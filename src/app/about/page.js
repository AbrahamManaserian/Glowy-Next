import { db } from '@/firebase';
import { Box, Grid, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

export default async function AboutPage() {
  let obj = [];
  let obj1 = [];
  const orderRef = doc(db, 'orders', '38');
  const orderRef1 = doc(db, 'orders', '27');
  const docSnap = await getDoc(orderRef1);
  if (docSnap.data()) {
    obj = docSnap.data().items;
  }
  const docSnap1 = await getDoc(orderRef);
  if (docSnap1.data()) {
    obj1 = docSnap1.data().items;
  }
  // console.log(obj);
  return (
    <Grid item container xs={12} justifyContent="center" alignItems="center">
      {obj.map((item, index) => {
        // console.log(index);
        if (index < 80) {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                width: { xs: 'calc(50% - 30px)', sm: 'calc(25% - 30px)' },
                padding: '10px',
                margin: 0,
                backgroundColor: 'red',
                margin: '5px',
                height: { xs: '150px', sm: '250px' },
                overflow: 'hidden',
              }}
            >
              <Image
                src={item.images[0].file}
                width={100}
                height={100}
                alt=""
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          );
        }
      })}
      <>
        {obj1.map((item, index) => {
          // console.log(index);
          if (index < 80) {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  width: { xs: 'calc(50% - 30px)', sm: 'calc(25% - 30px)' },
                  padding: '10px',
                  margin: 0,
                  backgroundColor: 'red',
                  margin: '5px',
                  height: { xs: '150px', sm: '250px' },
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={item.images[0].file}
                  width={100}
                  height={100}
                  alt=""
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </Box>
            );
          }
        })}
      </>
    </Grid>
  );
}
