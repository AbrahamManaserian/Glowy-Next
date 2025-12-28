import { Box, Typography } from '@mui/material';
import AdminOrdersPageUI from './_components/AdminOrdersPageUI';

export default function Loading() {
  return <AdminOrdersPageUI initialLoading={true} />;
  // return null;
}
