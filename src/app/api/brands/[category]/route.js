import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

// export const revalidate = 86400; // Cache for 1 day

export async function GET(request, { params }) {
  const { category } = await params;

  try {
    const docRef = doc(db, 'brands', category);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return Response.json(data[category] || []);
    } else {
      return Response.json([]);
    }
  } catch (error) {
    console.error('Error fetching brands:', error);
    return Response.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}
