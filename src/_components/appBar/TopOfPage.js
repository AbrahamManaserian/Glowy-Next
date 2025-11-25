'use client';

import { Grid } from '@mui/material';
import CategoriesDekstop from '../ui/CategoriesDekstop';
import SearchComponent from '../ui/SearchComponent';
import AppBarMenu from './AppBarMenu';
import AppHeader from './AppHeader';

export default function TopOfPage() {
  return (
    <>
      <AppHeader />
      <div></div>
      <AppBarMenu />
      <Grid sx={{ p: '10px 25px' }} item xs={12} container>
        <CategoriesDekstop />
        <SearchComponent />
      </Grid>
    </>
  );
}
