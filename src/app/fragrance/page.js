'use client';

import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import SortView from './componenets/SortView';
import Filter from './componenets/Filter';

export default function FragrancePage() {
  const [paramsState, setParamsState] = useState({ sortBy: '', view: '', gender: [], category: [] });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const keys = ['sortBy', 'view', 'gender', 'category'];
    const newState = {};
    keys.forEach((key) => {
      if (key === 'gender' || key === 'category') {
        const items = searchParams.get(key);
        const arrItems = items ? items.split(',') : [];
        newState[key] = arrItems;
      } else {
        newState[key] = searchParams.get(key) || '';
      }
    });
    setParamsState(newState);
  }, [searchParams]);

  // console.log(paramsState);

  const handleChangeCategoryParams = (value) => {
    let categories = [];
    if (paramsState.category.includes(value)) {
      categories = paramsState.category.filter((f) => f !== value);
    } else {
      categories = [...paramsState.category, value];
    }
    const newState = { ...paramsState, category: categories };
    setParamsState(newState);
    const params = new URLSearchParams(searchParams.toString());

    params.set('category', categories.join(','));
    router.push(`?${params.toString()}`);
  };

  const handleChangeParams = (key, value) => {
    if (key === 'gender') {
      let genderArr = [];
      if (paramsState[key].includes(value)) {
        genderArr = paramsState[key].filter((f) => f !== value);
      } else {
        genderArr = [...paramsState[key], value];
      }

      const newState = { ...paramsState, [key]: genderArr };
      setParamsState(newState);
      const params = new URLSearchParams(searchParams.toString());

      params.set('gender', genderArr.join(','));
      router.push(`?${params.toString()}`);
      // }
    } else {
      const newState = { ...paramsState, [key]: value };
      setParamsState(newState);
      const params = new URLSearchParams(searchParams.toString());

      params.set(key, value);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <Grid sx={{ m: { xs: '50px 15px', sm: '90px 35px' } }} size={12}>
      <Box
        sx={{
          display: 'flex',
          maxWidth: '1200px',
          margin: '0 auto', // center horizontally
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', width: '100%', mb: '60px', alignItems: 'flex-start' }}>
          <Typography
            sx={{
              fontSize: { xs: '18px', sm: '30px' },
              fontWeight: { xs: 500, sm: 600 },
              flexGrow: 1,
              lineHeight: { xs: '20px', sm: '30px' },
            }}
          >
            Fragrance
          </Typography>
          <SortView handleChangeParams={handleChangeParams} paramsState={paramsState} />
        </Box>
        {/* <Box sx={{ display: { xs: 'block', sm: 'none' } }}> */}
        <Filter
          handleChangeCategoryParams={handleChangeCategoryParams}
          handleChangeParams={handleChangeParams}
          paramsState={paramsState}
        />
        {/* </Box> */}
      </Box>
    </Grid>
  );
}
