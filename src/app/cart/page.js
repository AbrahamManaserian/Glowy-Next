import { Grid, Typography } from '@mui/material';

export default async function CartPage({ searchParams }) {
  const { item } = await searchParams;
  // console.log(item);

  return (
    <Grid container xs={12} direction="column" minHeight="320vh">
      <Typography> Cart page - item: {item}</Typography>
    </Grid>
  );
}
