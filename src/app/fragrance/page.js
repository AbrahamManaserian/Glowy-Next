import { Box, Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import SortView from './componenets/SortView1';
import FragrancePageUi from './pageUI';

export default async function FragrancePage({ searchParams }) {
  const search = await searchParams;

  console.log(search.category);

  return (
    <>
      <FragrancePageUi />
    </>

    // <Grid sx={{ m: { xs: '50px 15px', sm: '90px 35px' }, minHeight: '100vh' }} size={12}>
    //   <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' }}>
    //     <Typography
    //       sx={{
    //         fontSize: { xs: '18px', sm: '30px' },
    //         fontWeight: { xs: 500, sm: 600 },
    //         flexGrow: 1,
    //         lineHeight: { xs: '20px', sm: '30px' },
    //         mb: '20px',
    //       }}
    //     >
    //       Fragrance
    //     </Typography>

    //     <SortView
    //       //   toggleDrawer={toggleDrawer}
    //       //   handleChangeParams={handleChangeParams}
    //       //   paramsState={paramsState}
    //       searchParams={searchParams}
    //     />
    //     <Link href="/fragrance?category=fragrance&gender=women">About</Link>
    //   </Box>
    // </Grid>
  );
}
