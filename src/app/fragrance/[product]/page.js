import { Box, Grid, Rating, Typography } from '@mui/material';
import { Options } from '../components/Options';
import { ProductImageComp } from './ProductImageComp';
// import FragranceCard from '../componenets/FragranceCard';
import Image from 'next/image';
import Link from 'next/link';
import FragranceCard from '../components/FragranceCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import ProductPageUi from './components/PageUi';

export default async function FragranceProductPage({ params, searchParams }) {
  const { product } = await params;
  const url = await searchParams;
  // console.log(url);
  async function getProduct(params) {
    try {
      const productRef = doc(db, 'glowy-products', product);
      const docSnap = await getDoc(productRef);
      if (docSnap.data()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  const productData = await getProduct();

  const checkPrice = () => {
    let price;
    let previousePrice;
    if (url.option) {
      if (productData.availableOptions[url.option].optionDisacountedPrice) {
        price = productData.availableOptions[url.option].optionDisacountedPrice;
        previousePrice = productData.availableOptions[url.option].optionPrice;
      } else {
        price = productData.availableOptions[url.option].optionPrice;
      }
    } else if (productData.disacountedPrice) {
      price = productData.disacountedPrice;
      previousePrice = productData.price;
    } else {
      price = productData.price;
    }
    // console.log(price, previousePrice);
    return { price, previousePrice };
  };

  // const { price, previousePrice } = checkPrice();

  return (
    <Grid container size={12}>
      <ProductPageUi product={productData} />
      {/* <Box
            sx={{
              display: 'flex',
              width: '100%',
              maxWidth: '1150px',
              margin: '0 auto',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            <ProductImageComp images={[productData.mainImage, ...productData.images]} idNum={+product} />

            <Grid
              sx={{ mt: '50px' }}
              pl={{ xs: 0, sm: 0, md: '60px' }}
              size={{ xs: 12, sm: 12, md: 6 }}
              container
              direction={'column'}
              alignItems={'flex-start'}
            >
              {productData.inStock && (
                <Typography
                  sx={{
                    color: '#04903eff',
                    bgcolor: '#c8e6c97e',
                    borderRadius: '7px',
                    p: '3px 7px',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  In Stock
                </Typography>
              )}
              <Typography
                sx={{
                  color: '#263045fb',
                  fontSize: '25px',
                  fontWeight: 500,
                  mt: '25px',
                }}
              >
                {productData.brand}
              </Typography>
              <Typography
                sx={{
                  color: '#263045fb',
                  fontSize: '18px',
                  //   fontWeight: 500,
                  mt: '5px',
                }}
              >
                {productData.model}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '5px' }}>
                <Rating name="read-only" value={1} readOnly size="larg" />
                {productData.sold ? (
                  <Typography sx={{ color: '#3c4354a3', fontSize: '14px', lineHeight: '12px' }}>
                    {productData.sold} sold
                  </Typography>
                ) : null}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '20px' }}>
                <Typography sx={{ color: '#3c4354fb', fontWeight: 600, fontSize: '19px' }}>
                  ${price}
                </Typography>
                {previousePrice ? (
                  <Typography sx={{ textDecoration: 'line-through', color: 'gray', fontSize: '16px' }}>
                    ${previousePrice}
                  </Typography>
                ) : null}
              </Box>
              <Typography sx={{ color: '#3c4354f2', mt: '15px', fontSize: '14px', whiteSpace: 'pre-line' }}>
                {productData.descriptionEn}
              </Typography>
              <Options
                id={+product}
                options={productData.availableOptions || []}
                initialOption={productData.size}
              />
            </Grid>
          </Box> */}
      {/* 
          <Grid
            alignContent={'flex-start'}
            container
            size={12}
            mt={{ xs: '90px', sm: '120px' }}
            justifyContent={'center'}
          >
            <Grid sx={{ maxWidth: '1100px' }} spacing={'30px'} container>
              <Typography
                sx={{ fontSize: { xs: '18px', sm: '22px' }, width: '100%' }}
                fontWeight={700}
                color="#2B3445"
              >
                You May Also Like
              </Typography>
           
            </Grid>
            <Typography
              sx={{
                fontSize: { xs: '18px', sm: '22px' },
                width: '100%',
                mt: { xs: '100px', sm: '140px' },
                mb: '30px',
              }}
              fontWeight={700}
              color="#2B3445"
            >
              Create Your Gift Box
            </Typography>

            <Link style={{ WebkitTapHighlightColor: 'transparent', width: '100%' }} href={`/gifts`}>
              <Box
                sx={{
                  // position: 'relative',
                  width: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                {giftImage.map((img, index) => {
                  return (
                    <Box
                      sx={{
                        p: { xs: '5px', sm: '20px' },
                        height: { xs: '150px', sm: '300px' },
                        boxSizing: 'border-box',
                        width: '50%',
                        overflow: 'hidden',
                      }}
                      key={index}
                    >
                      <Image
                        src={img}
                        alt="Makeup Remover"
                        width={200}
                        height={200}
                        style={{
                          objectFit: 'cover',
                          transition: 'transform 0.6s ease',
                          width: '100%',
                          height: 'auto',
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Link>
          </Grid>
         */}
    </Grid>
  );
}
