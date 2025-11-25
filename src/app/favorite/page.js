'use client';

import { categories } from '@/_components/ui/CategoriesDekstop';
import { db } from '@/firebase';
import { Button, Grid, Typography } from '@mui/material';
import { arrayUnion, doc, increment, updateDoc } from 'firebase/firestore';

// const categoriesObj = categories;

const asd = {
  fragrance: {
    Fragrance: {
      Men: 'men',
      Women: 'women',
      Uni: 'uni',
      routTo: 'fragrance',
    },
    routTo: 'fragrance',
    name: 'Fragrance',
    'Car Air Fresheners': {
      routTo: 'car-air-fresheners',
    },
    'Home Air Fresheners': {
      routTo: 'home-air-fresheners',
    },
    Deodorant: {
      routTo: 'deodorant',
    },
  },
  Makeup: {
    Face: {
      Foundation: 'foundation',
      Highlighter: 'highlighter',
      'Face Primer': 'face-primer',
      'Powder & Setting Spray': 'powder-setting-spray',
      Contour: 'contour',
      Concealer: 'concealer',
      Blush: 'blush',
      'BB & CC cream': 'bb-cc-cream',
      routTo: 'face',
    },
    Eye: {
      'Brow Gel': 'brow-gel',
      'Eye Palettes': 'eye-palettes',
      'Eyebrow pencil': 'eyebrow-pencil',
      Eyeliner: 'eyeliner',
      Pencil: 'pencil',
      routTo: 'eye',
    },
    Lip: {
      Lipstick: 'lipstick',
      'Liquid Lipstick': 'liquid-lipstick',
      'Lip Balm & Treatmentl': 'lip-balm-treatmentl',
      'Lip Gloss': 'lip-gloss',
      'Lip Liner': 'lip-liner',
      'Lip Oil': 'lip-oil',
      routTo: 'lip',
    },
    routTo: 'makeup',
  },
  Skincare: {
    Cleansers: {
      Cleansers: 'cleansers',
      Exfoliation: 'exfoliation',
      'Face Wash': 'face-wash',
      'Makeup Removers': 'makeup-removers',
      'Toners & Lotions': 'toners-lotions',
      routTo: 'cleansers',
    },
    'Eye Care': {
      'Dark Circles': 'dark-circles',
      'Eye Patches': 'eye-patches',
      'Lifting/Anti-age Eye Creams': 'lifting-anti-age-eye-creams',
      routTo: 'eye-care',
    },
    Masks: {
      'Anti-age': 'anti-age',
      'Eye Patches': 'eye-patches',
      'Face Masks': 'face-masks',
      Hydrating: 'hydrating',
      routTo: 'masks',
    },
    Moisturizers: {
      'Face Creams': 'face-creams',
      'Face Oils': 'face-oils',
      Mists: 'mists',
      Moisturizers: 'moisturizers',
      'Night Creams': 'night-creams',
      'Anti-Aging': 'anti-aging',
      'Dark Spots': 'dark-spots',
      Lifting: 'lifting',
      'Face Serums': 'face-serums',
      routTo: 'masks',
    },
    routTo: 'moisturizers',
  },
  'Bath & Body': {
    'Bath & Shower': {
      Gel: 'gel',
      'Hand Wash & Soap': 'hand-wash-soap',
      'Scrub & Exfoliation': 'scrub-exfoliation',
      'Shampoo & Conditione': 'shampoo-conditione',
      routTo: 'bath-shower',
    },
    'Body Care': {
      Antiperspirants: 'antiperspirants',
      'Body Lotion & Body Oils': 'body-lotion-body-oils',
      'Body Moisturizers': 'body-moisturizers',
      'Cellulite & Stretch Marks': 'cellulite-stretch-marks',
      'Hand Cream & Foot Cream': 'hand-cream–foot-ream',
      'Masks & Special Treatment': 'masks-special-treatment',
      routTo: 'body-care',
    },
    routTo: 'bath-body',
  },
  Hair: {
    'Hair Styling': {
      Gel: 'gel',
      'Hand Wash & Soap': 'hand-wash-soap',
      'Scrub & Exfoliation': 'scrub-exfoliation',
      'Shampoo & Conditione': 'shampoo-conditione',
      routTo: 'hair-styling',
    },
    routTo: 'hair',
  },
  Nail: {
    Nail: {
      'Cuticle care': 'cuticle-care',
      'Nail care': 'nail-care',
      'Nail color': 'nail-color',
      'Nail polish removers': 'nail-polish-removers',
      routTo: 'nail',
    },
    routTo: 'nail',
  },
  'New Items': {
    'New Items': {
      routTo: 'new-items',
    },
    routTo: 'new-items',
  },
  Accessories: {
    Accessories: {
      routTo: 'accessories',
    },
    routTo: 'accessories',
  },
};
export default function Home() {
  const handleClick = async () => {
    const newObj = {};

    const detailRef = doc(db, 'details', 'categories');
    // await updateDoc(detailRef, categories);

    Object.keys(categories).map(async (key, i) => {
      // console.log(key.toLocaleLowerCase());
      newObj[key.toLocaleLowerCase()] = key;
    });
    console.log(newObj);
  };

  return (
    <Grid container xs={12} direction="column" minHeight="320vh">
      <Typography>Favorite Page</Typography>
      <Button onClick={() => handleClick()}>click</Button>
    </Grid>
  );
}
