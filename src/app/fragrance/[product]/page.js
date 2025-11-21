export const revalidate = 300;

import { Grid } from '@mui/material';

import ProductPageUi from './components/PageUi';
import { getProduct } from '@/app/lib/firebase/getFragranceProducts';

export default async function FragranceProductPage({ params }) {
  const { product } = await params;

  const productData = await getProduct(product);

  return (
    <Grid container size={12}>
      <ProductPageUi
        product={productData.item}
        relatedItems={productData.relatedItems}
        productData={productData}
      />
    </Grid>
  );
}
