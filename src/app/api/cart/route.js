import { NextResponse } from 'next/server';
import { getCartItems } from '@/_lib/firebase/getCartItems';

export async function POST(request) {
    try {
        const body = await request.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
        }

        const products = await getCartItems(ids);

        return NextResponse.json(products, {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
            'Netlify-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
            'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
          },
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
