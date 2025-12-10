'use client';

import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

export default function PagePagination() {
  const [page, setPage] = useState(1);
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <Pagination
      boundaryCount={1}
      siblingCount={1}
      color="primary"
      count={10}
      page={page}
      onChange={handlePageChange}
    />
  );
}
