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
import Link from 'next/link';
// import { ShoppingBasketIcon } from '@/components/icons';
import MovingIcon from '@mui/icons-material/Moving';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Image from 'next/image';
import { ProductImageComp } from './ProductImageComp';
import ItemCart, { handleClickAddToCart } from '@/_components/carts/ItemCart';
import { getBuyTogetherItems } from '@/app/api/item/relatedItems/route';

function ProductNotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: 8,
      }}
    >
      <Box
        sx={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          backgroundColor: '#f1f3f5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3,
          fontSize: 45,
        }}
      >
        😕
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Product Not Found
      </Typography>

      <Typography sx={{ mt: 1, color: 'text.secondary', maxWidth: 300 }}>
        {`We couldn't find the item you're looking for. It may have been removed or is unavailable.`}
      </Typography>

      <Button
        component={Link}
        href="/fragrance"
        variant="contained"
        sx={{ mt: 4, borderRadius: 3, px: 4, textTransform: 'capitalize' }}
      >
        Go Shopp
      </Button>
    </Box>
  );
}

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

export default function ProductPageUi({ product, data }) {
  let { buyTogetherItems, sameBrandItems, similarProducts } = data ? use(data) : [];
  const [togetherItems, setTogetherItems] = useState(buyTogetherItems);

  const [item, setItem] = useState(product);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loading, setLoading] = useState(false);
  const [availableOption, setAvailableOption] = useState(product.id);
  const [quantity, setQuantity] = useState(1);
  const { cart, setCart } = useGlobalContext();
  const router = useRouter();
  // console.log(buyTogetherItems);
  // console.log(item?.smallImage.width, item?.smallImage.height);
  const salePercent = item.previousPrice
    ? Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)
    : null;

  const changeOption = async (id) => {
    if (id === availableOption) return;
    setLoading(true);
    setAvailableOption(id);
    try {
      const productRef = doc(db, 'allProducts', id);
      const docSnap = await getDoc(productRef);
      if (docSnap.data()) {
        if (item.price !== docSnap.data().price) {
          const buyTogetherItems = await getBuyTogetherItems(20000 - docSnap.data().price, docSnap.data().id);
          setTogetherItems(buyTogetherItems);
        }
        setItem(docSnap.data());
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const handelClickBuyNow = () => {
    handleClickAddToCart(item, quantity, setCart, cart);
    router.push('/cart');
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
                  lineHeight: '24px',
                }}
              >
                {item.model}
                {item.subCategory === 'fragrance' ? ' for ' : ','} {item.type && `${item.type}, `}
                {` ${item[item.optionKey]}`}
                {item.optionKey === 'size' && 'ml'}
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
                href={`/${item.category}?&subCategory=${encodeURIComponent(
                  item.subCategory
                )}&brand=${encodeURIComponent(item.brand)}`}
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
                        cursor: product.id === availableOption ? '' : 'pointer',
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
                              cursor: option.id === availableOption ? '' : 'pointer',
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
                      onClick={() => handleClickAddToCart(item, quantity, setCart, cart)}
                      sx={{ bgcolor: '#2B3445', borderRadius: '10px' }}
                      variant="contained"
                      endIcon={<ShoppingBasketIcon color={'white'} />}
                    >
                      Add to cart
                    </Button>
                    <Button
                      onClick={() => handelClickBuyNow()}
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
          <Grid
            alignContent={'flex-start'}
            container
            size={12}
            // mt={{ xs: '70px', sm: '120px' }}
            justifyContent={'center'}
          >
            <>
              {togetherItems && togetherItems[0] && (
                <Grid
                  mt={{ xs: '70px', sm: '120px' }}
                  size={12}
                  sx={{ maxWidth: '1100px', boxSizing: 'border-box' }}
                  container
                  border={'solid #c0c3c7ff 0.5px'}
                  borderRadius={'10px'}
                  // spacing={{ xs: '10px', sm: '30px' }}
                  p={'10px'}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '16px', sm: '18px' },
                      width: '100%',
                      m: { xs: '0 0 10px 0', sm: '10px 0 20px 0' },
                    }}
                    fontWeight={600}
                    color="#2B3445"
                  >
                    Buy together — get <span style={{ color: '#d50000' }}>20%</span> off
                  </Typography>
                  <Box
                    sx={{
                      WebkitTapHighlightColor: 'transparent',
                      position: 'relative',
                      width: {
                        xs: 'calc(33.3% - 13.5px)',
                        sm: 'calc(33.3% - 13.5px)',
                        md: 'calc(24% - 20px)',
                      },
                      marginRight: { xs: '20px', sm: '20px', md: '40px' },
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: '35%',
                        right: { xs: '-18px', sm: '-25px' },
                        fontSize: '25px',
                        fontWeight: 500,
                        color: '#6d7581ff',
                      }}
                    >
                      +
                    </Typography>

                    <div
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        width: '100%',
                        overflow: 'hidden',
                        aspectRatio: '1 / 1',
                        boxSizing: 'border-box',
                        borderRadius: '15px',
                        border: '1px solid rgba(0,0,0,0.04)',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Image
                        width={200}
                        height={200}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          overflow: 'hidden',
                        }}
                        src={item.smallImage.file}
                        alt="image"
                      />
                    </div>
                    <Typography
                      sx={{
                        color: '#263045fb',
                        fontSize: { xs: '11px', sm: '14px' },
                        fontWeight: 500,
                        mt: '5px',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3, // number of lines
                      }}
                    >
                      <strong> This Item: </strong> {item.fullName}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#e52b2bff',
                        fontSize: { xs: '11px', sm: '14px' },
                        fontWeight: 500,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 'auto',
                      }}
                    >
                      ${Math.round(item.price * 0.8).toLocaleString()}
                      <span
                        style={{
                          marginLeft: '5px',
                          marginRight: 'auto',
                          color: '#263045fb',
                          textDecoration: 'line-through',
                          fontSize: '11px',

                          // paddingRight: '5px',
                        }}
                      >
                        ${item.price.toLocaleString()}
                      </span>
                      <span
                        style={{
                          border: 'solid 0.1px #e52b2bff',
                          borderRadius: '5px',
                          marginRight: '5px',
                          padding: '0 4px',
                        }}
                      >
                        Save ${Math.round(item.price * 0.2).toLocaleString()}
                      </span>
                    </Typography>
                  </Box>

                  {togetherItems.map((item, index, arr) => {
                    const mr = index !== arr.length - 1 ? { xs: '20px', sm: '20px', md: '40px' } : 0;

                    return (
                      <Box
                        key={index}
                        sx={{
                          WebkitTapHighlightColor: 'transparent',
                          position: 'relative',
                          width: {
                            xs: 'calc(33.3% - 13.5px)',
                            sm: 'calc(33.3% - 13.5px)',
                            md: 'calc(24% - 20px)',
                          },
                          marginRight: mr,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {index !== arr.length - 1 && (
                          <Typography
                            sx={{
                              position: 'absolute',
                              top: '35%',
                              right: { xs: '-18px', sm: '-25px' },
                              fontSize: '25px',
                              fontWeight: 500,
                              color: '#6d7581ff',
                            }}
                          >
                            +
                          </Typography>
                        )}
                        <Link
                          href={`/item/${item.id}`}
                          style={{
                            flexShrink: 0,
                            display: 'flex',
                            width: '100%',
                            overflow: 'hidden',
                            aspectRatio: '1 / 1',
                            boxSizing: 'border-box',
                            borderRadius: '15px',
                            border: '1px solid rgba(0,0,0,0.04)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                          }}
                        >
                          <Image
                            width={200}
                            height={200}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              overflow: 'hidden',
                            }}
                            src={item.smallImage.file}
                            alt="image"
                          />
                        </Link>

                        <Typography
                          sx={{
                            color: '#263045fb',
                            fontSize: { xs: '11px', sm: '14px' },
                            fontWeight: 500,
                            mt: '5px',
                            display: '-webkit-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3, // number of lines
                          }}
                        >
                          {item.fullName}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#e52b2bff',
                            fontSize: { xs: '11px', sm: '14px' },
                            fontWeight: 500,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 'auto',
                          }}
                        >
                          ${Math.round(item.price * 0.8).toLocaleString()}
                          <span
                            style={{
                              marginLeft: '5px',
                              marginRight: 'auto',
                              color: '#263045fb',
                              textDecoration: 'line-through',
                              fontSize: '11px',
                            }}
                          >
                            ${item.price.toLocaleString()}
                          </span>
                          <span
                            style={{
                              border: 'solid 0.1px #e52b2bff',
                              borderRadius: '5px',
                              // marginLeft: 'auto',
                              // marginLeft: '5px',
                              padding: '0 4px',
                            }}
                          >
                            Save ${Math.round(item.price * 0.2).toLocaleString()}
                          </span>
                        </Typography>
                      </Box>
                    );
                  })}

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      borderTop: { xs: 'solid 0.1px #6e6969ff', sm: 'solid 0.1px #6e6969ff', md: 0 },
                      alignItems: 'center',
                      width: { xs: '100%', sm: '100%', md: 'calc(28% - 20px)' },
                      p: { xs: 0, sm: 0, md: '15px' },
                      mt: { xs: '12px', sm: '12px', md: 0 },
                      boxSizing: 'border-box',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        my: '3px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        maxWidth: '400px',
                      }}
                    >
                      Item(s) total:
                      <strong>
                        $
                        {Math.round(
                          item.price + togetherItems.reduce((sum, item) => sum + item.price, 0)
                        ).toLocaleString()}
                      </strong>
                    </Typography>
                    <Typography
                      sx={{
                        my: '3px',
                        fontSize: '14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        maxWidth: '400px',
                      }}
                    >
                      Discounts:
                      <strong style={{ color: '#e52b2bff' }}>
                        -$
                        {Math.round(
                          (item.price + togetherItems.reduce((sum, item) => sum + item.price, 0)) * 0.2
                        ).toLocaleString()}
                      </strong>
                    </Typography>
                    <Typography
                      sx={{
                        my: '3px',
                        fontSize: '14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        maxWidth: '400px',
                      }}
                    >
                      Shipping:
                      <strong style={{ color: '#07870cff' }}>FREE</strong>
                    </Typography>
                    <Typography
                      sx={{
                        mt: '10px',
                        fontSize: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        fontWeight: 500,
                        maxWidth: '400px',
                      }}
                    >
                      Order Total:
                      <strong style={{}}>
                        $
                        {Math.round(
                          (item.price + togetherItems.reduce((sum, item) => sum + item.price, 0)) * 0.8
                        ).toLocaleString()}
                      </strong>
                    </Typography>

                    <Button
                      // onClick={() => handleClickAddToCart(item.id)}
                      sx={{
                        bgcolor: '#2B3445',
                        borderRadius: '10px',
                        textTransform: 'initial',
                        mt: '10px',
                        width: '100%',
                        maxWidth: '200px',
                      }}
                      variant="contained"
                      endIcon={<ShoppingBasketIcon color={'white'} />}
                    >
                      Add all 3 to cart
                    </Button>
                  </Box>
                </Grid>
              )}
            </>
            <>
              {similarProducts && similarProducts[0] && (
                <>
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
                      return (
                        <Grid key={index} size={{ xs: 6, sm: 3 }}>
                          <ItemCart item={item} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              )}
            </>

            <>
              {sameBrandItems && sameBrandItems[0] && (
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
                    Discover more from{' '}
                    <span>
                      <Link
                        style={{ color: '#1976d2', fontWeight: 500, marginLeft: '5px' }}
                        href={`/${item.category}?&subCategory=${encodeURIComponent(
                          item.subCategory
                        )}&brand=${encodeURIComponent(item.brand)}`}
                      >
                        {product.brand}
                      </Link>
                    </span>
                  </Typography>
                  {sameBrandItems.map((item, index) => {
                    return (
                      <Grid key={index} size={{ xs: 6, sm: 3 }}>
                        <ItemCart item={item} />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </>
          </Grid>
        </>
      ) : (
        <ProductNotFound />
      )}
      <PageLoading loading={loading} />
    </Grid>
  );
}
