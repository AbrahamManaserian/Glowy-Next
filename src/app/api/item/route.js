// import { getFragranceProducts } from '@/app/lib/firebase/getFragranceProducts';
// import { getProduct } from '@/app/_lib/firebase/getFragranceProducts';

import { getProduct } from '@/_lib/firebase/getProduct';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams);
    const item = await getProduct(params.id);

    // Ensure it always returns an object or array
    return new Response(JSON.stringify(item || {}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // 'Cache-Control': 'no-store', // always fetch fresh data
      },
    });
  } catch (error) {
    console.error('🔥 API fetch error:', error);

    // Return JSON with error message
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
