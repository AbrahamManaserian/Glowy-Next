'use client';

import { db } from '@/firebase';
import { Button, Grid, Pagination, PaginationItem, Typography } from '@mui/material';
import {
  arrayUnion,
  collection,
  deleteField,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit,
  limitToLast,
  orderBy,
  query,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const fragranceBrands = [
  'Amouage',
  'Ariana Grande',
  'Armaf',
  'Azzaro',
  'Bvlgari',
  'Burberry',
  'Byredo',
  'Calvin Klein',
  'Carolina Herrera',
  'Chanel',
  'Christian Dior',
  'Clive Christian',
  'Creed',
  'Diptyque',
  'Dolce & Gabbana',
  'Ermenegildo Zegna',
  'Givenchy',
  'Giorgio Armani',
  'Gucci',
  'Guerlain',
  'Hermès',
  'Hugo Boss',
  'Initio Parfums Privés',
  'Issey Miyake',
  'Jean Paul Gaultier',
  'Jo Malone London',
  'Kilian Paris',
  'Lancôme',
  'Le Labo',
  'Maison Francis Kurkdjian',
  'Maison Margiela',
  'Mancera',
  'Mugler',
  'Montale',
  'Montblanc',
  'Narciso Rodriguez',
  'Paco Rabanne',
  'Parfums de Marly',
  'Penhaligon’s',
  'Prada',
  'Roja Parfums',
  'Salvatore Ferragamo',
  'Tiziana Terenzi',
  'Tom Ford',
  'Valentino',
  'Versace',
  'Xerjoff',
  'Yves Saint Laurent',
  'Zara',
];

export default function Home() {
  const [page, setPage] = useState(1);
  const [startId, setStartId] = useState(null);
  const [endId, setEndId] = useState(null);
  const [pageIds, setPageIds] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const [sum, setSum] = useState(0);

  const handlePageChange = async (e, value) => {
    try {
      if (value === 1) {
        setPage(value);
        // const item = await getDoc(doc(db, 'glowyProducts', 'fragrance', 'items', startId || ''));
        const q = query(
          collection(db, 'glowyProducts', 'fragrance', 'items'),
          where('subCategory', '==', 'fragrance'),
          // where('type', '==', 'Men'),
          orderBy('highlighted', 'desc'),
          // endBefore(item),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const itemIds = querySnapshot.docs.map((doc) => doc.id);
        const lastItemId = querySnapshot.docs[querySnapshot.docs.length - 1].id;
        setEndId(lastItemId);
        setPageIds(itemIds);
      } else if (value === Math.ceil(allIds.length / 5)) {
        const item = await getDoc(doc(db, 'glowyProducts', 'fragrance', 'items', endId));
        setPage(value);
        const q = query(
          collection(db, 'glowyProducts', 'fragrance', 'items'),
          where('subCategory', '==', 'fragrance'),
          // where('type', '==', 'Men'),
          orderBy('highlighted', 'desc'),
          startAfter(item),
          limitToLast(3)
        );
        const querySnapshot = await getDocs(q);
        const itemIds = querySnapshot.docs.map((doc) => doc.id);
        const startItemId = querySnapshot.docs[0].id;
        setStartId(startItemId);
        setPageIds(itemIds);
      } else if (value < page) {
        const item = await getDoc(doc(db, 'glowyProducts', 'fragrance', 'items', startId));
        // console.log(item.data());

        setPage(value);
        const q = query(
          collection(db, 'glowyProducts', 'fragrance', 'items'),
          where('subCategory', '==', 'fragrance'),
          // where('type', '==', 'Men'),
          orderBy('highlighted', 'desc'),
          endBefore(item),
          limitToLast(3)
        );
        const querySnapshot = await getDocs(q);
        const itemIds = querySnapshot.docs.map((doc) => doc.id);
        const endItemId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
        const startItemId = querySnapshot.docs[0]?.id;
        setStartId(startItemId);
        setEndId(endItemId);
        setPageIds(itemIds);
      } else if (value > page) {
        const item = await getDoc(doc(db, 'glowyProducts', 'fragrance', 'items', endId));

        setPage(value);
        const q = query(
          collection(db, 'glowyProducts', 'fragrance', 'items'),
          where('subCategory', '==', 'fragrance'),
          // where('type', '==', 'Men'),
          orderBy('highlighted', 'desc'),
          startAfter(item),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const itemIds = querySnapshot.docs.map((doc) => doc.id);
        const endItemId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
        const startItemId = querySnapshot.docs[0]?.id;
        setStartId(startItemId);
        setEndId(endItemId);
        setPageIds(itemIds);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if (!sum) {
          console.log('asd');
          const countSnap = await getCountFromServer(
            query(
              collection(db, 'glowyProducts', 'fragrance', 'items'),
              where('subCategory', '==', 'fragrance'),
              // where('type', '==', 'Men'),
              orderBy('highlighted', 'desc')
            )
          );
          const totalDocs = countSnap.data().count;
          setSum(totalDocs);
        }
        if (!allIds[0]) {
          console.log('ddd');
          const q = query(
            collection(db, 'glowyProducts', 'fragrance', 'items'),
            where('subCategory', '==', 'fragrance'),
            // where('type', '==', 'Men'),
            orderBy('highlighted', 'desc')
          );

          const querySnapshot = await getDocs(q);
          const itemIds = querySnapshot.docs.map((doc) => doc.id);
          setAllIds(itemIds);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  });

  return (
    <Grid
      container
      size={12}
      justifyContent={'center'}
      mt="50px"
      minHeight="100vh"
      alignItems={'flex-start'}
      alignContent={'flex-start'}
    >
      <Typography width={'100%'}>Favorite Page</Typography>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
        {/* {Array.from({ length: 10 }).map((item, index) => {
          if(index-)
          return (
            <PaginationItem
              color="primary"
              selected={index === page}
              value={index}
              onClick={() => handlePageChange(index)}
              page={index}
              key={index}
            />
          );
        })} */}
        <Pagination
          // siblingCount={page < 3 ? 0 : 1}
          siblingCount={1}
          boundaryCount={1}
          color="primary"
          count={Math.ceil(allIds.length / 5)}
          page={page}
          onChange={handlePageChange}
        />
      </div>
      <Button onClick={() => handleClick()}>click</Button>

      <Typography m={'10px'} width={'100%'}>
        Totoal items count - {sum}
      </Typography>
      <Typography m={'10px'} width={'100%'}>
        last Id - {endId}
      </Typography>
      <Typography m={'10px'} width={'100%'}>
        First Id - {startId}
      </Typography>

      <div style={{ display: 'flex', width: '100%', margin: '10px' }}>
        {pageIds.map((item, index) => {
          return (
            <Typography sx={{ margin: '2px', fontSize: '12px' }} key={index}>
              {item}
            </Typography>
          );
        })}
      </div>
      <div style={{ display: 'flex', width: '100%', margin: '10px', flexWrap: 'wrap' }}>
        {allIds.map((item, index) => {
          return (
            <Typography
              sx={{ margin: '2px', fontSize: '12px', bgcolor: pageIds.includes(item) ? 'red' : '' }}
              key={index}
            >
              {item}
            </Typography>
          );
        })}
      </div>
    </Grid>
  );
}
