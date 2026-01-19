import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { db as adminDb } from '../../../_lib/firebase/admin';
import admin from 'firebase-admin';
import { sendTelegramNotification } from '../../../_lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, userId, applyBonus, paymentMethod, shippingMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // 1. Run Transaction
    const result = await adminDb.runTransaction(async (t) => {
      // A. Reads
      const projectDetailsRef = adminDb.collection('details').doc('projectDetails');
      const projectDetailsDoc = await t.get(projectDetailsRef);

      if (!projectDetailsDoc.exists) {
        throw new Error('Project details missing');
      }

      // Read User Data if userId present
      let userData = null;
      let userRef = null;
      if (userId) {
        userRef = adminDb.collection('users').doc(userId);
        const userDoc = await t.get(userRef);
        if (userDoc.exists) {
          userData = userDoc.data();
        }
        // Check verification status from Auth (more secure than Firestore field if possible,
        // but explicit Admin Auth check is extra call. Using Firestore field usually synced?
        // CartPageUi checks user.emailVerified (Auth object).
        // Server needs valid way to check emailVerified.
        // We can fetch userRecord from Auth.
        try {
          const userRecord = await admin.auth().getUser(userId);
          if (userData) {
            // Overlay auth status onto userData for logic consistency
            userData.emailVerified = userRecord.emailVerified;
          }
        } catch (e) {
          console.error('Error fetching user auth record', e);
        }
      }

      // Read All Product Data
      // Optimally, we read all products in parallel or use 'in' query if <= 30 items
      const itemIds = [...new Set(items.map((i) => i.id))];
      const productsRefs = itemIds.map((id) => adminDb.collection('allProducts').doc(id));
      const productDocs = await t.getAll(...productsRefs);
      const productsMap = {};
      productDocs.forEach((doc) => {
        if (doc.exists) {
          productsMap[doc.id] = doc.data();
        }
      });

      // B. Calculations
      let subtotal = 0;
      let savedFromOriginalPrice = 0;
      const orderItems = [];

      for (const item of items) {
        const product = productsMap[item.id];
        if (!product) {
          throw new Error(`Product ${item.id} not found`);
        }

        // Resolve Price & Stock
        let price = product.price || 0;
        let previousPrice = product.previousPrice || 0;

        // Image Resolution - matching DetailedCartItem logic:
        // data.smallImage?.file ?? data.images?.[0]?.file ?? data.img ?? data.image ?? '/images/placeholder.png';
        let variantImage = '';
        if (product.smallImage?.file) {
          variantImage = product.smallImage.file;
        } else if (product.images?.[0]?.file) {
          variantImage = product.images[0].file;
        } else {
          variantImage = product.img || product.image || '/images/placeholder.png';
        }

        let optionKey = product.optionKey || null;
        let selectedOptionKey = product.optionKey || null; // Default to product optionKey

        // Stock Check Logic matching CartPageUi
        let inStock = product.inStock !== false; // Default true unless explicitly false

        if (item.selectedOption) {
          // Check availableOptions
          if (product.availableOptions && Array.isArray(product.availableOptions)) {
            // Find matching option
            const matchedOption = product.availableOptions.find((o) => o[optionKey] === item.selectedOption);

            if (matchedOption) {
              if (matchedOption.inStock === false) inStock = false;
              if (matchedOption.price !== undefined) price = matchedOption.price;
              if (matchedOption.previousPrice !== undefined) previousPrice = matchedOption.previousPrice;
            }
          } else if (optionKey && product[optionKey] === item.selectedOption) {
            // matched main option
          }
        } else {
          // No option selected
          if (product.inStock === false) inStock = false;
        }

        if (!inStock) {
          throw new Error(`Item ${product.name || product.title} is out of stock`);
        }

        const qty = item.quantity || 1;
        subtotal += price * qty;

        if (previousPrice > price) {
          savedFromOriginalPrice += (previousPrice - price) * qty;
        }

        // Prepare Item Data mirroring Client behavior (...restItem)
        // We spread the underlying product data, but exclude fields handled explicitly or internal
        const { quantity: _q, price: _p, options: _o, availableOptions: _ao, ...restProduct } = product;

        orderItems.push({
          id: item.id,
          ...restProduct,
          name: product.name || product.title || '',
          image: variantImage,
          price,
          quantity: qty,
          selectedOption: item.selectedOption || null,
          selectedOptionKey: selectedOptionKey,
        });
      }

      // C. Discounts & Totals
      // Shipping
      let shippingCost = 0;
      if (shippingMethod === 'express') shippingCost = 3000;
      else if (shippingMethod === 'standart') shippingCost = 1000;

      const isFreeAvailable = subtotal >= 5000;
      if (isFreeAvailable && shippingMethod === 'standart') {
        shippingCost = 0;
      }
      const shippingSavings = isFreeAvailable && shippingMethod === 'standart' ? 1000 : 0;

      // Discounts
      const isEligibleForFirstShopDiscount = userData && (userData.firstShopping || userData.firstShopp);
      const isFirstShopDiscountActive = isEligibleForFirstShopDiscount && userData.emailVerified;
      const firstShopDiscount = isFirstShopDiscountActive ? subtotal * 0.2 : 0;

      const EXTRA_DISCOUNT_THRESHOLD = 20000;
      const extraDiscount =
        subtotal >= EXTRA_DISCOUNT_THRESHOLD
          ? isFirstShopDiscountActive
            ? subtotal * 0.05
            : subtotal * 0.1
          : 0;

      const totalDiscount = extraDiscount + firstShopDiscount;

      // Bonus
      // "bonus" available to user
      const userBonusTotal = userData
        ? Math.floor((userData.totalSpent - (userData.bonusUsed || 0)) * 0.03)
        : 0;
      let appliedBonus = 0;
      if (applyBonus && userData) {
        // Cap bonus at (Subtotal + Shipping - Discounts)
        const maxApplicable = subtotal + shippingCost - totalDiscount;
        appliedBonus = Math.min(userBonusTotal, maxApplicable);
      }

      const total = subtotal + shippingCost - totalDiscount - appliedBonus;
      const totalSaved = savedFromOriginalPrice + totalDiscount + shippingSavings + appliedBonus;

      // D. Order Creation
      const lastOrderNumber = projectDetailsDoc.data().lastOrderNumber || 0;
      const newOrderNumber = lastOrderNumber + 1;
      const formattedOrderNumber = newOrderNumber.toString().padStart(7, '0');

      const orderRef = adminDb.collection('orders').doc(formattedOrderNumber);

      const newOrder = {
        orderNumber: formattedOrderNumber,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        userId: userId || null,
        customer: {
          fullName: customer.fullName || '',
          phoneNumber: customer.phoneNumber || '',
          address: customer.address || '',
          email: customer.email || '',
          note: customer.note || '',
        },
        items: orderItems,
        financials: {
          subtotal,
          shippingCost,
          extraDiscount,
          firstShopDiscount,
          bonusApplied: appliedBonus,
          total,
          savedFromOriginalPrice,
          shippingSavings,
          totalSaved,
        },
        paymentMethod: paymentMethod || 'cash',
        shippingMethod: shippingMethod || 'standart', // use validated method
      };

      // Updates
      t.update(projectDetailsRef, { lastOrderNumber: newOrderNumber });
      t.set(orderRef, newOrder);

      // User Updates
      if (userData && userRef) {
        // Address/Phone update?
        const updates = {};
        if ((!userData.address && customer.address) || body.saveUserInfo) updates.address = customer.address;
        if ((!userData.phoneNumber && customer.phoneNumber) || body.saveUserInfo)
          updates.phoneNumber = customer.phoneNumber;

        if (userData.firstShopp) updates.firstShopp = false; // Note field name 'firstShopp' in DB vs 'firstShopping' in logic?
        // Logic used 'userData.firstShopping'.
        // Let's check CartPageUi.js:
        // `userData?.firstShopping` for reading.
        // `await updateDoc(userRef, { firstShopp: false });` for writing.
        // This implies the DB field is `firstShopp` but maybe mapped to `firstShopping` in context?
        // Or is there an inconsistency?
        // Context: `const isEligibleForFirstShopDiscount = user && userData?.firstShopping;`
        // Let's assume userData comes from context which might normalize it.
        // But here we read from DB directly. I should check the DB field name.
        // 'firstShopp' seems to be the write key. I'll read both or check exactly.
        // Assuming 'firstShopp' is the DB key based on updateDoc.

        // Re-reading logic in CartPageUi:
        // `if (userData?.firstShopp) { ... updateDoc ... { firstShopp: false } }`
        // Wait, earlier logic used `userData?.firstShopping` ?
        // `const isEligibleForFirstShopDiscount = user && userData?.firstShopping;`
        // `if (userData?.firstShopp)`
        // It seems inconsistent in CartPageUi.js!
        // Line 301: `userData?.firstShopping`
        // Line 464: `if (userData?.firstShopp)`
        // I will use `firstShopp` for DB operations, and check both for read just in case.
        // Update firstShopping to false after first order
        if (userData.firstShopping) {
          updates.firstShopping = false;
        }

        if (appliedBonus > 0) {
          const newBonusUsed = (userData.bonusUsed || 0) + appliedBonus / 0.03;
          updates.bonusUsed = newBonusUsed;
        }

        if (Object.keys(updates).length > 0) {
          t.update(userRef, updates);
        }
      }

      return { orderNumber: formattedOrderNumber, total, customer };
    });

    // 2. Notification (Post transaction)
    try {
      const msg = `
🛒 *New Order #${result.orderNumber}*
👤 ${result.customer.fullName}
📞 ${result.customer.phoneNumber}
💰 Total: ${result.total.toLocaleString()} ֏
`;
      await sendTelegramNotification(msg);
    } catch (e) {
      console.error('Notification failed', e);
    }

    return NextResponse.json({ success: true, orderId: result.orderNumber });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let ids = [];

    // Handle ?ids=1,2,3 for guest users
    const idsParam = searchParams.get('ids');
    if (idsParam && idsParam.includes(',')) {
      ids = idsParam.split(',');
    } else {
      ids = searchParams.getAll('ids');
    }

    if (userId) {
      // Signed-in user: fetch by userId
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        where('status', '!=', 'delivered'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return { id: doc.id, ...data, createdAt: data.createdAt.toDate().toISOString() };
      });

      return NextResponse.json(ordersData, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    } else if (ids.length > 0) {
      // Guest user: fetch by order IDs
      const orderPromises = ids.map(async (orderId) => {
        const q = query(
          collection(db, 'orders'),
          where('orderNumber', '==', orderId),
          where('status', '!=', 'delivered'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
          const doc = querySnapshot.docs[0];
          return { id: doc.id, ...doc.data() };
        } else {
          return null;
        }
      });
      const ordersData = (await Promise.all(orderPromises)).filter(Boolean).map((order) => ({
        ...order,

        createdAt: order.createdAt.toDate().toISOString(),
      }));

      return NextResponse.json(ordersData, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    } else {
      return NextResponse.json({ error: 'Missing userId or ids' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
