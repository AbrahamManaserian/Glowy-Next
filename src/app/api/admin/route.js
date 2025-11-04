import { getAdminData } from '@/app/lib/firebase/getAdminData';

export async function GET(req) {
  try {
    // Fetch suppliers from Firestore

    const data = await getAdminData();

    // Ensure it always returns an object or array
    return new Response(JSON.stringify(data || {}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // always fetch fresh data
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
