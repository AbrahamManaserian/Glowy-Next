'use client';

import { categories } from '@/_components/ui/CategoriesDekstop';
import { db } from '@/firebase';
import { Button, Grid, Typography } from '@mui/material';
import { arrayUnion, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
// const perfumeNotes100 = [
//   'Agarwood (Oud)',
//   'Aldehydes',
//   'Almond',
//   'Amber',
//   'Ambergris',
//   'Ambrette',
//   'Apricot',
//   'Apple',
//   'Basil',
//   'Bergamot',
//   'Black Cherry',
//   'Black Currant',
//   'Black Pepper',
//   'Blood Orange',
//   'Blueberry',
//   'Cardamom',
//   'Caramel',
//   'Cashmeran',
//   'Cedarwood',
//   'Cinnamon',
//   'Citrus',
//   'Coconut',
//   'Coffee',
//   'Coriander',
//   'Cotton Flower',
//   'Cranberry',
//   'Cucumber',
//   'Cyclamen',
//   'Dark Chocolate',
//   'Davana',
//   'Fig',
//   'Fir Balsam',
//   'Freesia',
//   'Gardenia',
//   'Ginger',
//   'Grapefruit',
//   'Green Notes',
//   'Guaiac Wood',
//   'Hazelnut',
//   'Heliotrope',
//   'Honey',
//   'Incense',
//   'Iris',
//   'Jasmine',
//   'Juniper',
//   'Kiwi',
//   'Labdanum',
//   'Lavender',
//   'Lemon',
//   'Lily',
//   'Lily of the Valley',
//   'Lime',
//   'Leather',
//   'Magnolia',
//   'Mandarin',
//   'Mango',
//   'Marine Notes',
//   'Mint',
//   'Musk',
//   'Myrrh',
//   'Neroli',
//   'Nutmeg',
//   'Oakmoss',
//   'Orange Blossom',
//   'Oregano',
//   'Orris',
//   'Papaya',
//   'Patchouli',
//   'Peach',
//   'Pear',
//   'Pepper',
//   'Pine',
//   'Pineapple',
//   'Pink Pepper',
//   'Plum',
//   'Pomegranate',
//   'Raspberry',
//   'Red Berries',
//   'Rose',
//   'Rosemary',
//   'Saffron',
//   'Sage',
//   'Sandalwood',
//   'Sea Salt',
//   'Strawberry',
//   'Tangerine',
//   'Tea',
//   'Tobacco',
//   'Tonka Bean',
//   'Tuberose',
//   'Vanilla',
//   'Vetiver',
//   'Violet',
//   'Warm Spices',
//   'White Musk',
//   'White Pepper',
//   'White Tea',
//   'Woody Notes',
//   'Ylang-Ylang',
// ];

export default function Home() {
  const handleClick = async () => {
    const detailRef = doc(db, 'details', 'project-details');
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
