'use client';

import { Box, Button, Grid, IconButton, Rating, Typography } from '@mui/material';
import { ProductImageComp } from './ProductImageComp';
import { use, useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { NoSearchIcon, ShoppingBasketIcon } from '@/_components/icons';
import { useGlobalContext } from '@/app/GlobalContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import FragranceCard from '../../_components/FragranceCard';
import useGetWindowDimensions from '@/_hooks/useGetWindowSize';
// import { ShoppingBasketIcon } from '@/components/icons';

const PageLoading = ({ loading }) => {
  return (
    <>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            right: 'calc(50% - 20px)',
            width: '32px',
            height: '32px',
            border: '3px solid rgba(0, 0, 0, 0.1)',
            borderTop: '3px solid #2196f3',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            zIndex: 1000000,
          }}
        ></div>
      )}
      {loading && (
        <div
          style={{
            position: 'absolute', // 👈 key difference — relative to the parent
            inset: 0,
            backdropFilter: 'blur(0.5px)',
            background: 'rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px', // optional, matches parent if rounded
            zIndex: 10,
          }}
        >
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

const NoProduct = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        maxWidth: '1150px',
        margin: '0 auto',
        flexWrap: 'wrap',
        alignItems: 'flex-start',

        justifyContent: 'center',
        // minHeight: '60vh',
        alignContent: 'center',
        my: '10px',
      }}
    >
      <Typography
        sx={{ fontSize: { xs: '16px', sm: '20px' }, width: '100%', textAlign: 'center' }}
        fontWeight={700}
        color="#2B3445"
      >
        Product not found <br />
        {/* It may have been removed or is out of stock. */}
      </Typography>
      <Box sx={{ width: '30%', my: '10px' }}>
        <NoSearchIcon color="#5980b4ff" />
      </Box>
      <Typography
        sx={{ fontSize: { xs: '16px', sm: '20px' }, width: '100%', textAlign: 'center' }}
        fontWeight={700}
        color="#2B3445"
      >
        It may have been removed or is out of stock.
      </Typography>
    </Box>
  );
};

export default function ProductPageUi({ sameBrandItems, product, similarItems }) {
  const relatedItems = sameBrandItems ? use(sameBrandItems) : [];
  const windowDimensions = useGetWindowDimensions();
  const [item, setItem] = useState(product);
  const [loading, setLoading] = useState(false);
  const [availableOption, setAvailableOption] = useState(product.id);
  const [quantity, setQuantity] = useState(1);
  const { cart, setCart } = useGlobalContext();
  const router = useRouter();

  const changeOption = async (id) => {
    setLoading(true);
    setAvailableOption(id);
    try {
      const productRef = doc(db, 'glowy-products', id);
      const docSnap = await getDoc(productRef);
      if (docSnap.data()) {
        setItem(docSnap.data());
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const handleClickAddToCart = (id) => {
    // setOpenCartAlert({ id: id, qount: quantity });
  };

  return (
    <Grid sx={{ m: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' } }} container size={12}>
      {item.id ? (
        <>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              maxWidth: '1150px',
              margin: '0 auto',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            <ProductImageComp images={[item.mainImage, ...item.images]} idNum={item.id} />
            <Grid
              sx={{ mt: '25px', position: 'relative' }}
              pl={{ xs: 0, sm: 0, md: '60px' }}
              size={{ xs: 12, sm: 12, md: 6 }}
              container
              direction={'column'}
              alignItems={'flex-start'}
            >
              <Typography
                sx={{ position: 'absolute', top: 0, right: 0, color: '#59625aff', fontSize: '12px' }}
              >
                lot - {item.id}
              </Typography>
              {item.inStock && (
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
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Typography
                  sx={{
                    color: '#263045fb',
                    fontSize: '26px',
                    fontWeight: 600,
                    mt: '10px',
                  }}
                >
                  {item.brand}
                </Typography>
                <Typography mb="5px" ml="10px" fontSize="14px">
                  {item.size + item.unit}
                </Typography>
              </div>
              <Typography
                sx={{
                  color: '#263045fb',
                  fontSize: '18px',
                }}
              >
                {item.model}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '5px' }}>
                <Rating name="read-only" value={4.5} precision={0.5} readOnly size="larg" />
                {item.sold ? (
                  <Typography sx={{ color: '#3c4354a3', fontSize: '14px', lineHeight: '12px' }}>
                    {item.sold} sold
                  </Typography>
                ) : null}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '20px' }}>
                <Typography sx={{ color: '#3c4354fb', fontWeight: 600, fontSize: '19px' }}>
                  ${item.price.toLocaleString()}
                </Typography>
                {item.previousePrice ? (
                  <Typography sx={{ textDecoration: 'line-through', color: 'gray', fontSize: '16px' }}>
                    ${item.previousePrice.toLocaleString()}
                  </Typography>
                ) : null}
              </Box>
              <Typography sx={{ color: '#3c4354f2', mt: '15px', fontSize: '14px', whiteSpace: 'pre-line' }}>
                {item.descriptionEn}
              </Typography>

              <Box sx={{ display: 'flex', mt: '25px', flexWrap: 'wrap' }}>
                {product.availableOptions.length > 0 && (
                  <>
                    <Typography sx={{ color: '#212122da', fontWeight: 500, width: '100%', mb: '10px' }}>
                      Available Options ({product.optionKey})
                    </Typography>
                    <Box
                      onClick={() => changeOption(product.id)}
                      sx={{
                        border:
                          availableOption === product.id
                            ? 'solid 1.5px rgba(69, 73, 69, 0.53)'
                            : 'solid 1px rgba(44, 43, 43, 0.11)',
                        p: '6px 15px',
                        borderRadius: '8px',
                        m: '5px 10px 5px 0',
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <Typography sx={{ color: '#212122da', fontSize: '14px', fontWeight: 500 }}>
                        {product[product.optionKey]}
                        {product.optionKey === 'size' ? product.unit : ''}
                      </Typography>
                    </Box>
                    <>
                      {product.availableOptions.map((option, index) => {
                        return (
                          <Box
                            key={index}
                            onClick={() => changeOption(option.id)}
                            sx={{
                              border:
                                option.id === availableOption
                                  ? 'solid 1.5px rgba(69, 73, 69, 0.53)'
                                  : 'solid 1px rgba(44, 43, 43, 0.11)',
                              p: '6px 15px',
                              borderRadius: '8px',
                              m: '5px 10px 5px 0',
                              cursor: 'pointer',
                              WebkitTapHighlightColor: 'transparent',
                            }}
                          >
                            <Typography sx={{ color: '#212122da', fontSize: '14px', fontWeight: 500 }}>
                              {option[item.optionKey]} {item.optionKey === 'size' ? item.unit : ''}
                            </Typography>
                          </Box>
                        );
                      })}
                    </>
                  </>
                )}
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    marginTop: '20px',
                    flexWrap: 'wrap',
                    alignItems: 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      border: 'solid 0.5px #65626263',
                      borderRadius: '10px',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      mr: '15px',
                    }}
                  >
                    <IconButton
                      disabled={quantity < 2 ? true : false}
                      onClick={() => setQuantity(quantity - 1)}
                      aria-label="delete"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ bgcolor: '#6562620f', p: '10px 25px', fontSize: '14px' }}>
                      {quantity}{' '}
                    </Typography>
                    <IconButton onClick={() => setQuantity(quantity + 1)} aria-label="delete">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', mt: '15px' }}>
                    <Button
                      onClick={() => handleClickAddToCart(item.id)}
                      sx={{ bgcolor: '#2B3445', borderRadius: '10px' }}
                      variant="contained"
                      endIcon={<ShoppingBasketIcon color={'white'} />}
                    >
                      Add to cart
                    </Button>
                    <Button
                      //   onClick={() => handelClickBuyNow(id)}
                      sx={{ ml: '10px', bgcolor: '#f44336', borderRadius: '10px' }}
                      variant="contained"
                    >
                      Buy now
                    </Button>
                  </Box>
                </div>
              </Box>
            </Grid>
          </Box>
        </>
      ) : (
        <NoProduct />
      )}
      <PageLoading loading={loading} />
      <Grid
        alignContent={'flex-start'}
        container
        size={12}
        mt={{ xs: '90px', sm: '120px' }}
        justifyContent={'center'}
      >
        <Grid size={12} sx={{ maxWidth: '1100px' }} spacing={'30px'} container>
          <Typography
            sx={{ fontSize: { xs: '18px', sm: '22px' }, width: '100%' }}
            fontWeight={700}
            color="#2B3445"
          >
            You May Also Like
          </Typography>
          {relatedItems.map((item, index) => {
            return <FragranceCard height={windowDimensions.width} key={index} item={item} />;
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}
