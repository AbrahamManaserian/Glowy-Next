import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderId, customerName, total, phoneNumber } = await request.json();

    // Log in production for debugging (remove after fixing)
    console.log('🔔 PRODUCTION: Notification API called for order:', orderId);

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Check environment variables
    const hasToken = !!botToken;
    const hasChatId = !!chatId;

    console.log('🔍 PRODUCTION: Telegram config check:');
    console.log('- Has bot token:', hasToken);
    console.log('- Has chat ID:', hasChatId);

    if (!hasToken || !hasChatId) {
      console.error('❌ PRODUCTION: Telegram credentials missing!');
      console.error('- TELEGRAM_BOT_TOKEN:', hasToken ? 'SET' : 'MISSING');
      console.error('- TELEGRAM_CHAT_ID:', hasChatId ? 'SET' : 'MISSING');
      return NextResponse.json({ message: 'Notification skipped - credentials missing' }, { status: 200 });
    }

    const message = `
📦 *New Order Received!*
Order ID: #${orderId}
Customer: ${customerName}
Phone: ${phoneNumber}
Total: ֏${total.toLocaleString()}

Check admin panel for details.
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    console.log('📡 PRODUCTION: Telegram API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ PRODUCTION: Telegram API failed:', errorText);
      throw new Error(`Telegram API error: ${response.status} - ${errorText}`);
    }

    console.log('✅ PRODUCTION: Telegram notification sent successfully for order:', orderId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
