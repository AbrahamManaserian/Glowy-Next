import ItemCart from '@/_components/carts/ItemCart';
import { db } from '@/firebase';
import { Box, Grid, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

export default async function AboutPage() {
  let obj = [];
  const orderRef1 = doc(db, 'orders', '27');
  const docSnap = await getDoc(orderRef1);
  if (docSnap.data()) {
    obj = docSnap.data().items;
  }
  // console.log(obj);
  return (
    <Grid container size={12} justifyContent="center" alignItems="center" p={'15px'} spacing={3}>
      {obj.map((item, index) => {
        // console.log(item);
        if (index < 80) {
          return (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 3 }}>
              <ItemCart
                item={{
                  id: item.code,
                  size: '75',
                  unit: 'ml',
                  price: '10500',
                  smallImage: item.images[0],
                  brand: item.name,
                }}
              />
            </Grid>

            // <Box
            //   key={index}
            //   sx={{
            //     display: 'flex',
            //     justifyContent: 'center',
            //     alignContent: 'center',
            //     alignItems: 'center',
            //     width: { xs: 'calc(50% - 30px)', sm: 'calc(25% - 30px)' },
            //     padding: '10px',
            //     margin: 0,
            //     backgroundColor: 'red',
            //     margin: '5px',
            //     height: { xs: '150px', sm: '250px' },
            //     overflow: 'hidden',
            //   }}
            // >
            //   <Image
            //     src={item.images[0].file}
            //     width={100}
            //     height={100}
            //     alt=""
            //     style={{
            //       width: '100%',
            //       height: 'auto',
            //     }}
            //   />
            // </Box>
          );
        }
      })}
    </Grid>
  );
}
