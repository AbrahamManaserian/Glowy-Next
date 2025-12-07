'use client';

import { categories } from '@/_components/ui/CategoriesDekstop';
import { db } from '@/firebase';
import { Button, Grid, Typography } from '@mui/material';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

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
  const handleClick = async () => {
    // const detailRef = doc(db, 'details', 'project-details');
    // // const data = await getDoc(detailRef);
    // const idsRef = doc(db, 'details', 'projectDetails');
    // await updateDoc(idsRef, { fragranceBrands: fragranceBrands });
    // const querySnapshot = await getDocs(query(collection(db, 'glowy-products')));
    // await Promise.all(
    //   querySnapshot.docs.map(async (item) => {
    //     const category = item.data().category;
    //     const subCategory = item.data().subCategory;
    //     const productRef = doc(db, 'glowyProducts', category, subCategory, item.id);
    //     const allProductsRef = doc(db, 'allProducts', item.id);
    //     await setDoc(allProductsRef, item.data());
    //     await setDoc(productRef, item.data());
    //     // doc.data() is never undefined for query doc snapshots
    //     // console.log(doc.id, ' => ', doc.data());
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
    <Grid container xs={12} direction="column" minHeight="320vh">
      <Typography>Favorite Page</Typography>
      <Button onClick={() => handleClick()}>click</Button>
    </Grid>
  );
}
