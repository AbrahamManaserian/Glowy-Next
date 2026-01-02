'use client';

import { db } from '@/firebase';
import { Button, Grid, Typography } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';

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

const makeupBrands = [
  'Anastasia Beverly Hills',
  'BareMinerals',
  'Bath & Body Works',
  'Becca Shimmering Skin Perfector',
  'Benefit',
  'Bobbi Brown',
  'Bourjois',
  'Caudalie',
  'Chanel',
  'Clarins',
  'Clinique',
  'Coty',
  'Dior',
  'e.l.f.',
  'Essence',
  'Estée Lauder',
  'Fenty Beauty',
  'Guerlain',
  'H&M Beauty',
  'IT Cosmetics',
  'Kylie Cosmetics',
  "L'Oreal Paris",
  'La Mer',
  'La Prairie',
  'Lancôme',
  'Laura Mercier',
  'Lush',
  'MAC',
  'Maybelline',
  'Milani',
  'NARS',
  'NYX',
  'Procter & Gamble',
  'Revlon',
  'Rimmel',
  'SEPHORA COLLECTION',
  'Shiseido',
  'Sisley',
  'SK-II',
  'Smashbox',
  'Stila',
  'Tarte',
  'The Body Shop',
  'The Ordinary',
  'Tom Ford Beauty',
  'Urban Decay',
  "Victoria's Secret",
  'Vichy',
  'Wet n Wild',
  'YSL Beauty',
];

export default function Home() {
  async function name(params) {
    const docRef = doc(db, 'brands', 'fragrance');
    await setDoc(docRef, { fragrance: fragranceBrands });
  }

  async function addMakeupBrands() {
    const docRef = doc(db, 'brands', 'makeup');
    await setDoc(docRef, { makeup: makeupBrands });
  }

  return (
    <Grid container xs={12} direction="column" minHeight="320vh">
      {/* <Button onClick={name}>Add Fragrance Brands</Button>
      <Button onClick={addMakeupBrands}>Add Makeup Brands</Button> */}
      <Typography>Gifts Page</Typography>
    </Grid>
  );
}
