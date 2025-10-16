import { getSuppliers } from '@/app/lib/firebase/getSuppliers';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const suppliers = await getSuppliers();
    // Check if the request is from admin pages

    return new Response(JSON.stringify(suppliers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=3600, s-maxage=7200, stale-while-revalidate=3600`, // no caching for admin
      },
    });
  } catch (error) {
    console.error('API fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
