'use client';

import { Box, Button, IconButton, Paper, Typography, Grid } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ShoppingBasketIcon } from '@/_components/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useGlobalContext } from '@/app/GlobalContext';
import { handleClickAddToCart } from '@/_components/carts/ItemCart';
import { handleAddItemToWishList } from '@/_functions/hadleAddItemToWishList';

export default function WishlistItem({ item }) {
  const { cart, setCart, wishList, setWishList } = useGlobalContext();

  const handleAddToCart = () => {
    handleClickAddToCart(item, 1, setCart, cart);
  };

  const handleRemove = () => {
    handleAddItemToWishList(item.id, setWishList, wishList);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid #E0E0E0',
        borderRadius: '12px',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: '#E57373',
          boxShadow: '0 4px 12px rgba(229, 115, 115, 0.15)',
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Image */}
        <Grid size={{ xs: 6 }}>
          <Link href={`/item/${item.id}`} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%', // 1:1 Aspect Ratio
                borderRadius: '8px',
                overflow: 'hidden',
                bgcolor: '#f5f5f5',
              }}
            >
              {item.smallImage?.file && (
                <Image
                  src={item.smallImage.file}
                  alt={item.name || 'Product Image'}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              )}
            </Box>
          </Link>
        </Grid>

        {/* Details */}
        <Grid size={{ xs: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Link href={`/item/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.brand} {item.model}
              </Typography>
            </Link>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.category}
            </Typography>

            <Typography variant="subtitle1" color="#E57373" fontWeight="bold" sx={{ mb: 1 }}>
              ${item.price}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mt: 'auto', justifyContent: 'flex-end' }}>
              <IconButton
                size="small"
                onClick={handleAddToCart}
                sx={{
                  border: '1px solid #E57373',
                  borderRadius: '8px',
                  color: '#E57373',
                  '&:hover': { bgcolor: 'rgba(229, 115, 115, 0.04)' },
                }}
              >
                <ShoppingBasketIcon size="20" color="#E57373" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleRemove}
                sx={{
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  color: '#9E9E9E',
                  '&:hover': { color: '#E57373', borderColor: '#E57373', bgcolor: 'transparent' },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
