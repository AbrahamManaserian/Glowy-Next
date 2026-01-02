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
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('FavoritePage');
  const [page, setPage] = useState(1);
  const [startId, setStartId] = useState(null);
  const [endId, setEndId] = useState(null);
  const [pageIds, setPageIds] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const [sum, setSum] = useState(0);

  const handlePageChange = async (e, value) => {
    setPage(value);
    // try {
    //   if (value === 1) {
    //     setPage(value);
    //     // const item = await getDoc(doc(db, 'glowyProducts', 'fragrance', 'items', startId || ''));
    //     const q = query(
    //       collection(db, 'glowyProducts', 'fragrance', 'items'),
    //       where('subCategory', '==', 'carfre'),
    //       // where('type', '==', 'Men'),
    //       orderBy('highlighted', 'desc'),
    //       // endBefore(item),
    //       limit(3)
    //     );
    //     const querySnapshot = await getDocs(q);
    //     const itemIds = querySnapshot.docs.map((doc) => doc.id);
    //     const lastItemId = querySnapshot.docs[querySnapshot.docs.length - 1].id;
    //     setEndId(lastItemId);
    //     setPageIds(itemIds);
    //   } else if (value === Math.ceil(allIds.length / 5)) {
    //     const item = await getDoc(doc(db, 'glowyProducts', 'fragrance', 'items', endId));
    //     setPage(value);
    //     const q = query(
    //       collection(db, 'glowyProducts', 'fragrance', 'items'),
    //       where('subCategory', '==', 'fragrance'),
    //       // where('type', '==', 'Men'),
    //       orderBy('highlighted', 'desc'),
    //       startAfter(item),
    //       limitToLast(3)
    //     );
    //     const querySnapshot = await getDocs(q);
    //     const itemIds = querySnapshot.docs.map((doc) => doc.id);
    //     const startItemId = querySnapshot.docs[0].id;
    //     setStartId(startItemId);
    //     setPageIds(itemIds);
    //   } else if (value < page) {
    //     const item = await getDoc(doc(db, 'glowyProducts', 'fragrance', 'items', startId));
    //     // console.log(item.data());
    //     setPage(value);
    //     const q = query(
    //       collection(db, 'glowyProducts', 'fragrance', 'items'),
    //       where('subCategory', '==', 'fragrance'),
    //       // where('type', '==', 'Men'),
    //       orderBy('highlighted', 'desc'),
    //       endBefore(item),
    //       limitToLast(3)
    //     );
    //     const querySnapshot = await getDocs(q);
    //     const itemIds = querySnapshot.docs.map((doc) => doc.id);
    //     const endItemId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
    //     const startItemId = querySnapshot.docs[0]?.id;
    //     setStartId(startItemId);
    //     setEndId(endItemId);
    //     setPageIds(itemIds);
    //   } else if (value > page) {
    //     const item = await getDoc(doc(db, 'glowyProducts', 'fragrance', 'items', endId));
    //     setPage(value);
    //     const q = query(
    //       collection(db, 'glowyProducts', 'fragrance', 'items'),
    //       where('subCategory', '==', 'fragrance'),
    //       // where('type', '==', 'Men'),
    //       orderBy('highlighted', 'desc'),
    //       startAfter(item),
    //       limit(3)
    //     );
    //     const querySnapshot = await getDocs(q);
    //     const itemIds = querySnapshot.docs.map((doc) => doc.id);
    //     const endItemId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
    //     const startItemId = querySnapshot.docs[0]?.id;
    //     setStartId(startItemId);
    //     setEndId(endItemId);
    //     setPageIds(itemIds);
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       if (!sum) {
  //         console.log('asd');
  //         const countSnap = await getCountFromServer(
  //           query(
  //             collection(db, 'glowyProducts', 'fragrance', 'items'),
  //             where('subCategory', '==', 'fragrance'),
  //             // where('type', '==', 'Men'),
  //             orderBy('highlighted', 'desc')
  //           )
  //         );
  //         const totalDocs = countSnap.data().count;
  //         setSum(totalDocs);
  //       }
  //       if (!allIds[0]) {
  //         console.log('ddd');
  //         const q = query(
  //           collection(db, 'glowyProducts', 'fragrance', 'items'),
  //           where('subCategory', '==', 'fragrance'),
  //           // where('type', '==', 'Men'),
  //           orderBy('highlighted', 'desc')
  //         );

  //         const querySnapshot = await getDocs(q);
  //         const itemIds = querySnapshot.docs.map((doc) => doc.id);
  //         setAllIds(itemIds);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   getData();
  // });

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
      <Typography width={'100%'}>{t('title')}</Typography>

      <Button onClick={() => handleClick()}>{t('click')}</Button>

      <Typography m={'10px'} width={'100%'}>
        {t('totalItems')} - {sum}
      </Typography>
      <Typography m={'10px'} width={'100%'}>
        {t('lastId')} - {endId}
      </Typography>
      <Typography m={'10px'} width={'100%'}>
        {t('firstId')} - {startId}
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
