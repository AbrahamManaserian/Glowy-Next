import { db } from '@/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

export default async function Page() {
  // const data = await fetch('https://api.vercel.app/blog')
  // const posts = await data.json()
  const obj = {};
  const q = query(collection(db, 'orders'), orderBy('creationDate', 'desc'), limit(30));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // console.log(doc.id);
    obj['+' + doc.id] = doc.data();
  });
  // console.log(obj);

  return (
    <ul>
      {Object.keys(obj).map((id) => {
        return (
          <li key={id}>
            <img src={obj[id].image.file} style={{ width: '15%', height: 'auto' }} />
            {obj[id].updatedDate}
          </li>
        );
      })}
    </ul>
  );
}
