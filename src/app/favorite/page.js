'use client';

import { db } from '@/firebase';
import { Button, Grid, Pagination, Typography } from '@mui/material';
import {
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useState } from 'react';

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
  const [page, setPagse] = useState(1);

  const handlePageChange = (e, value) => {
    setPagse(value);
  };

  const handleClick = async () => {
    // const detailRef = doc(db, 'details', 'project-details');
    // // const data = await getDoc(detailRef);
    // const idsRef = doc(db, 'details', 'projectDetails');
    // await updateDoc(idsRef, { fragranceBrands: fragranceBrands });
    // const querySnapshot = await getDocs(query(collection(db, 'allProducts')));
    // await Promise.all(
    //   querySnapshot.docs.map(async (item) => {
    //     const itemRef = doc(db, 'allProducts', item.id);
    //     await updateDoc(itemRef, {
    //       fullName: item.data().name,
    //       name: deleteField(),
    //     });
    //   })
    // );
    // setDoc(detailRef, perfumeNotes);
    // const data = await getDoc(detailRef);
    // updateDoc(detailRef, {
    //   perfumeNotes: perfumeNotes100,
    // });
    // console.log(data.data());
    // await updateDoc(detailRef, categories);
  };

  return (
    <Grid container size={12} justifyContent={'center'} mt="50px" minHeight="100vh" alignItems={'flex-start'}>
      <Typography width={'100%'}>Favorite Page</Typography>

      <Pagination
        boundaryCount={1}
        siblingCount={1}
        color="primary"
        count={7}
        page={page}
        onChange={handlePageChange}
      />

      {/* <Button onClick={() => handleClick()}>click</Button> */}
    </Grid>
  );
}
