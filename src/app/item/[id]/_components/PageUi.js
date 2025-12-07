'use client';

import { Box, Button, Grid, IconButton, Rating, Typography } from '@mui/material';
import React, { use, useEffect, useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { NoSearchIcon, ShoppingBasketIcon } from '@/_components/icons';
import { useGlobalContext } from '@/app/GlobalContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import useGetWindowDimensions from '@/_hooks/useGetWindowSize';
import Link from 'next/link';
// import { ShoppingBasketIcon } from '@/components/icons';
import MovingIcon from '@mui/icons-material/Moving';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Image from 'next/image';
import { ProductImageComp } from './ProductImageComp';
import FragranceCart from '@/_components/carts/FragranceCart';

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

export default function ProductPageUi({ product, data }) {
  const { sameBrandItems, similarProducts } = data ? use(data) : [];

  const windowDimensions = useGetWindowDimensions();
  const [item, setItem] = useState(product);

  useEffect(() => {
    if (sameBrandItems) {
      sameBrandItems.forEach((element) => {
        console.log(element.name === item.name);
      });
    }
  }, [sameBrandItems]);

  const [loading, setLoading] = useState(false);
  const [availableOption, setAvailableOption] = useState(product.id);
  const [quantity, setQuantity] = useState(1);
  const { cart, setCart } = useGlobalContext();
  const router = useRouter();
  // console.log(item?.smallImage.width, item?.smallImage.height);
  const salePercent = item.previousPrice
    ? Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)
    : null;

  const changeOption = async (id) => {
    setLoading(true);
    setAvailableOption(id);
    try {
      const productRef = doc(db, 'allProducts', id);
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
              <Typography
                sx={{
                  color: '#263045fb',
                  fontSize: { xs: '24px', sm: '28px' },
                  fontWeight: 600,
                  mt: '10px',
                }}
              >
                {item.brand}
              </Typography>
              <Typography
                sx={{
                  color: '#263045fb',
                  fontSize: { xs: '18px', sm: '20px' },
                  // fontWeight: 500,
                  mb: '15px',
                  lineHeight: '20px',
                }}
              >
                {item.model} for {item.type}
              </Typography>

              <Typography
                sx={{
                  color: '#263045fb',
                }}
              >
                Size - {item.size + item.unit}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '5px' }}>
                <Rating name="read-only" value={4.5} precision={0.5} readOnly size="small" />

                <Typography sx={{ color: '#3c4354a3', fontSize: '14px', lineHeight: '14px' }}>
                  Sold - {item.sold || 2}
                </Typography>
              </Box>
              <Link
                style={{ textDecoration: 'none', marginTop: '5px' }}
                href={`/fragrance?&subCategory=fragrance&brand=${item.brand}`}
              >
                <Typography
                  sx={{
                    color: '#2196f3',
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                >
                  Brand: {item.brand}
                </Typography>
              </Link>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: '20px' }}>
                {salePercent && (
                  <>
                    {salePercent < 0 ? (
                      <MovingIcon sx={{ fontSize: '20px', color: '#068a3dff', mr: '4px' }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: '20px', color: 'red', mr: '4px' }} />
                    )}
                    <Typography
                      sx={{
                        color: salePercent < 0 ? '#068a3dff' : 'red',
                        fontSize: '20px',
                        fontWeight: 100,
                        lineHeight: '20px',
                        mr: '10px',
                      }}
                    >
                      {salePercent * -1}%
                    </Typography>
                  </>
                )}
                <Typography sx={{ color: '#3c4354fb', fontWeight: 500, fontSize: '22px' }}>
                  ${item.price.toLocaleString()}
                </Typography>
              </Box>

              {salePercent && (
                <Typography
                  sx={{
                    color: '#646a6dff',
                    fontSize: '14px',
                  }}
                >
                  Last price: {item.previousPrice.toLocaleString()}
                </Typography>
              )}

              <Typography
                sx={{ mt: '15px', mb: '10px', fontSize: '15px', whiteSpace: 'pre-line', color: '#263045fb' }}
              >
                {item.descriptionEn}
              </Typography>

              {item.notes &&
                Object.keys(item.notes).map((key, index) => {
                  return (
                    <div key={index} style={{ display: 'flex', marginTop: '10px' }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: '#39445bfb',
                          textTransform: 'capitalize',
                          textWrap: 'nowrap',
                          minWidth: '100px',
                        }}
                      >
                        {key} notes:
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: '#ff3d00', ml: '10px', textWrap: 'wrap' }}>
                        {item.notes[key].join(', ')}
                      </Typography>
                    </div>
                  );
                })}

              <Box sx={{ display: 'flex', mt: '25px', flexWrap: 'wrap' }}>
                {product.availableOptions.length > 0 && (
                  <>
                    <Typography sx={{ fontWeight: 500, width: '100%', mb: '10px' }}>
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
        mt={{ xs: '70px', sm: '120px' }}
        justifyContent={'center'}
      >
        {/* {relatedItems && relatedItems[0] && relatedItems[1] && (
          <>
            <Typography
              sx={{
                fontSize: { xs: '18px', sm: '22px' },
                width: '100%',
                maxWidth: '1100px',

                pb: '5px',
                mb: '25px',
              }}
              fontWeight={700}
              color="#2B3445"
            >
              Frequently Bought Together
            </Typography>
            <Grid
              justifyContent={'center'}
              border={'solid #c0c3c7ff 0.5px'}
              p={{ xs: '10px', sm: '40px' }}
              size={12}
              sx={{ maxWidth: '1100px' }}
              alignItems={'stretch'}
              container
              borderRadius={'8px'}
            >
              <Grid
                sx={{ width: { xs: 'calc(33% + 10px)', sm: 'calc(25% + 10px)' } }}
                container
                direction={'column'}
              >
                <div
                  style={{
                    display: 'flex',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    flexGrow: 1,
                  }}
                >
                  <Image
                    width={500}
                    height={500}
                    style={{
                      width: 'calc(100% - 30px)',
                      height: 'auto',
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      borderRadius: '9px',
                      boxSizing: 'border-box',
                    }}
                    src={item.smallImage.file}
                    alt="image"
                  />
                  <Typography
                    sx={{ width: '30px', textAlign: 'center', fontSize: '25px', color: '#353e4eff' }}
                  >
                    +
                  </Typography>
                </div>
                <Typography
                  sx={{
                    color: '#263045fb',
                    fontSize: '15px',
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'block' },
                    marginTop: 'auto',
                    mt: '10px',
                  }}
                >
                  {item.brand}
                  <span style={{ color: '#3c4354a3', fontSize: '12px', fontWeight: 400, marginLeft: '5px' }}>
                    {item.size}
                    {item.unit}
                  </span>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 400 }}>{item.model}</span>
                </Typography>
              </Grid>

              <Grid
                sx={{ width: { xs: 'calc(33% + 10px)', sm: 'calc(25% + 10px)' } }}
                container
                direction={'column'}
              >
                <div
                  style={{
                    display: 'flex',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    // flexGrow: 1,
                  }}
                >
                  <Image
                    width={500}
                    height={500}
                    style={{
                      width: 'calc(100% - 30px)',
                      height: 'auto',
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      borderRadius: '9px',
                      boxSizing: 'border-box',
                    }}
                    src={relatedItems[0].smallImage.file}
                    alt="image"
                  />
                  <Typography
                    sx={{ width: '30px', textAlign: 'center', fontSize: '25px', color: '#353e4eff' }}
                  >
                    +
                  </Typography>
                </div>
                <Typography
                  sx={{
                    marginTop: 'auto',
                    color: '#263045fb',
                    fontSize: '15px',
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'block' },
                    mt: '10px',
                  }}
                >
                  {relatedItems[0].brand}
                  <span style={{ color: '#3c4354a3', fontSize: '12px', fontWeight: 400, marginLeft: '5px' }}>
                    {relatedItems[0].size}
                    {relatedItems[0].unit}
                  </span>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 400 }}>
                    {relatedItems[0].model}
                  </span>
                </Typography>
              </Grid>
              <Grid
                sx={{ width: { xs: 'calc(33% - 20px)', sm: 'calc(25% - 20px)' } }}
                container
                direction={'column'}
                // justifyContent={'flex-start'}
              >
                <div
                  style={{
                    display: 'flex',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    width={500}
                    height={500}
                    style={{
                      width: 'calc(100%)',
                      height: 'auto',
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      borderRadius: '9px',
                      boxSizing: 'border-box',
                    }}
                    src={relatedItems[1].smallImage.file}
                    alt="image"
                  />
                </div>
                <Typography
                  sx={{
                    color: '#263045fb',
                    fontSize: '15px',
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'block' },
                    marginTop: 'auto',
                    mt: '10px',
                  }}
                >
                  {relatedItems[1].brand}
                  <span style={{ color: '#3c4354a3', fontSize: '12px', fontWeight: 400, marginLeft: '5px' }}>
                    {relatedItems[1].size}
                    {relatedItems[1].unit}
                  </span>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 400 }}>
                    {relatedItems[1].model}
                  </span>
                </Typography>
              </Grid>

              <Grid
                sx={{ width: { xs: '100%', sm: '25%' }, mt: { xs: '10px', sm: 0 }, p: '15px' }}
                container
                direction={'column'}
                alignContent={'center'}
                justifyContent={'center'}
              >
                <Typography sx={{ fontSize: '14px', textAlign: 'center' }}>
                  Total Price: <span style={{ fontSize: '16px', fontWeight: 500 }}>$250,00</span>
                </Typography>
                <Button
                  fullWidth
                  sx={{ mt: '5px', textTransform: 'none', bgcolor: '#f44336', borderRadius: '10px' }}
                  variant="contained"
                >
                  Add all to cart
                </Button>
              </Grid>
            </Grid>
          </>
        )} */}
        {similarProducts && similarProducts[0] && (
          <Grid
            mt={{ xs: '70px', sm: '120px' }}
            size={12}
            sx={{ maxWidth: '1100px' }}
            spacing={{ xs: '10px', sm: '20px' }}
            container
          >
            <Typography
              sx={{
                fontSize: { xs: '18px', sm: '22px' },
                width: '100%',
                borderBottom: 'solid #c0c3c7ff 0.5px',
                pb: '5px',
                mb: '5px',
              }}
              fontWeight={700}
              color="#2B3445"
            >
              Similar Products From Other Brands
            </Typography>
            {similarProducts.map((item, index) => {
              return <FragranceCart height={windowDimensions.width} key={index} item={item} />;
            })}
          </Grid>
        )}

        {sameBrandItems && sameBrandItems[0] && (
          <Grid
            mt={{ xs: '70px', sm: '120px' }}
            size={12}
            sx={{ maxWidth: '1100px' }}
            spacing={{ xs: '10px', sm: '20px' }}
            container
          >
            <Typography
              sx={{ fontSize: { xs: '18px', sm: '22px' }, width: '100%' }}
              fontWeight={700}
              color="#2B3445"
            >
              {product.brand} - For Men
            </Typography>
            {sameBrandItems.map((item, index) => {
              return <FragranceCart height={windowDimensions.width} key={index} item={item} />;
            })}
          </Grid>
        )}
        {/* <Grid
          mt={{ xs: '70px', sm: '120px' }}
          size={12}
          sx={{ maxWidth: '1100px' }}
          spacing={{ xs: '10px', sm: '20px' }}
          container
        >
          <Typography
            sx={{ fontSize: { xs: '18px', sm: '22px' }, width: '100%' }}
            fontWeight={700}
            color="#2B3445"
          >
            {product.brand} - For Women
          </Typography>
          {sameBrandItemsWomen &&
            sameBrandItemsWomen.map((item, index) => {
              return <FragranceCart height={windowDimensions.width} key={index} item={item} />;
            })}
        </Grid> */}
      </Grid>
    </Grid>
  );
}
