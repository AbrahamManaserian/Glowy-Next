import { NextResponse } from 'next/server';
import { getCartItems } from '@/_lib/firebase/getCartItems';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let ids = [];

    // Handle ?ids=1,2,3
    const idsParam = searchParams.get('ids');
    if (idsParam && idsParam.includes(',')) {
      ids = idsParam.split(',');
    } else {
      // Handle ?ids=1&ids=2
      ids = searchParams.getAll('ids');
    }

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    const products = await getCartItems(ids);

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600, vary=query',
        'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600, vary=query',
        Vary: 'Accept-Encoding',
      },
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
