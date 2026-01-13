'use client';

import { Grid, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function AdminPage({ searchParams }) {
  const t = useTranslations('AdminPage');
  // const url = await searchParams;
  return (
    <Grid size="12" padding={'10px'}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {t('welcome')}
      </Typography>
    </Grid>
  );
}
