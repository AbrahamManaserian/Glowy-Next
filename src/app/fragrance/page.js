// 'use client';

import { Grid } from '@mui/material';

// import { Box, Grid, Typography } from '@mui/material';
// import { use, useState } from 'react';
// import Filter from './componenets/Filter';

// export default function Page({ params, searchParams }) {
//   const [paramsState, setParamsState] = useState({
//     sortBy: '',
//     view: '',
//     minPrice: '',
//     maxPrice: '',
//     gender: [],
//     category: [],
//     brands: [],
//     inStock: 'noCheck',
//   });
//   const slug = use(params);
//   const query = use(searchParams);
//   console.log(query);
//   return (
//     <Grid sx={{ m: { xs: '50px 15px', sm: '90px 35px' }, minHeight: '100vh' }} size={12}>
//       <Typography>fragrance</Typography>
//       <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, width: '250px', mt: '40px' }}>
//         <Filter
//           paramsState={paramsState}
//           // handleChangeParams={handleChangeParams}
//           makeRout={true}
//           // handleChangeArrayParams={handleChangeArrayParams}
//         />
//       </Box>
//     </Grid>
//   );
// }

export default async function Page({ searchParams }) {
  const search = await searchParams;
  console.log(search);

  return (
    <Grid sx={{ m: { xs: '50px 15px', sm: '90px 35px' }, minHeight: '100vh' }} size={12}>
      <h1>ng</h1>
      <p>Search query: </p>
      <p>Current page: </p>
      <p>Sort order: </p>
    </Grid>
  );
}
