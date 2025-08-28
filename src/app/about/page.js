import { db } from '@/firebase';
import { Box, Grid, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';

export default async function Page() {
  let obj = [];

  const orderRef = doc(db, 'orders', '38');
  const docSnap = await getDoc(orderRef);
  if (docSnap.data()) {
    obj = docSnap.data().items;
  }
  // console.log(obj);
  return (
    <Grid item container xs={12} justifyContent="center" alignItems="center">
      <Typography>dfsd sale</Typography>
      {obj.map((item, index) => {
        return (
          <Box
            sx={{ disp: 'flex', alignItems: 'center', maxWidth: { xs: '45vw', sm: '20vw' }, p: '10px' }}
            key={index}
          >
            <img src={item.images[0].file} style={{ width: '100%', height: 'auto' }} />
            <Typography> {item.code} </Typography>
          </Box>
        );
      })}
    </Grid>
  );
}
