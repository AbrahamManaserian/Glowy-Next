'use client';

import { Box, Typography, Button, Grid, CircularProgress } from '@mui/material';
import { Favorite, DeleteOutline } from '@mui/icons-material';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import WishlistItem from './WishlistItem';

export default function WishlistTab({ user, setWishList, wishListDetails, wishListLoading }) {
  const handleClearWishlist = async () => {
    setWishList([]);
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { wishList: [] }, { merge: true });
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    } else {
      localStorage.setItem('fav', JSON.stringify([]));
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          My Wishlist
        </Typography>
        {wishListDetails.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutline />}
            onClick={handleClearWishlist}
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Clear Wishlist
          </Button>
        )}
      </Box>
      {wishListLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : wishListDetails.length > 0 ? (
        <Grid container spacing={2}>
          {wishListDetails.map((item) => (
            <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
              <WishlistItem item={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <Favorite sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
          <Typography>Your wishlist is empty.</Typography>
        </Box>
      )}
    </>
  );
}
