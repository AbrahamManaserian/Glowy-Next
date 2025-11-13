'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, CircularProgress, Drawer, Grid, Typography } from '@mui/material';
import SortView from './SortView';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Filter from './Filter';
import FragranceCard from './FragranceCard';
import FragrancePagination from './FragrancePagination';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

export default function PageUi({ data }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});
  useEffect(() => {
    setLoading(false);
  }, [data]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [paramsState, setParamsState] = useState({
    sortBy: '',
    view: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    subCategory: '',
    brand: '',
    inStock: 'noCheck',
  });

  const applyFilters = () => {
    toggleDrawer(false);
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(paramsState).forEach((key) => {
      params.set(key, paramsState[key]);
    });

    // sessionStorage.setItem('app-scroll:' + params.toString(), String(window.scrollY));
    router.push(`?${params.toString()}`);
  };

  const toggleDrawer = (newOpen) => {
    setOpenDrawer(newOpen);
  };

  const doRout = (prop, value) => {
    router.refresh();
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (prop === 'category') {
      params.set('type', []);
      params.set('brands', []);
    }
    params.set(prop, value);
    router.push(`?${params.toString()}`);
  };

  const doArrayRoute = (prop, arr) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(prop, arr.join(','));
    router.push(`?${params.toString()}`);
  };

  const handleChangeParams = (prop, value, noRout) => {
    if (prop === 'subCategory') {
      setParamsState({ ...paramsState, [prop]: value, type: '', brands: '' });
    } else {
      setParamsState({ ...paramsState, [prop]: value });
    }
    if (!noRout) {
      doRout(prop, value);
    }
  };

  const handleChangeArrayParams = (prop, value, noRout) => {
    let items = [];
    if (value === 'clean') {
    } else if (paramsState[prop].includes(value)) {
      items = paramsState[prop].filter((f) => f !== value);
    } else {
      items = [...paramsState[prop], value];
    }
    const newState = { ...paramsState, [prop]: items };
    setParamsState(newState);
    if (!noRout) {
      doArrayRoute(prop, items);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const newState = {};
    Object.keys(paramsState).forEach((key) => {
      newState[key] = searchParams.get(key) || '';
    });
    setParamsState(newState);
  }, [searchParams]);

  return (
    <Grid sx={{ m: { xs: '50px 15px', sm: '90px 35px' } }} size={12}>
      {Object.keys(data).length}
      <Box
        sx={{
          display: 'flex',
          maxWidth: '1200px',
          margin: '0 auto',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Typography
            sx={{
              fontSize: { xs: '18px', sm: '30px' },
              fontWeight: { xs: 500, sm: 600 },
              flexGrow: 1,
              lineHeight: { xs: '20px', sm: '30px' },
              mb: '20px',
            }}
          >
            Fragrance
          </Typography>
          <SortView
            toggleDrawer={toggleDrawer}
            handleChangeParams={handleChangeParams}
            paramsState={paramsState}
          />
        </Box>
        <Grid container sx={{ width: '100%', flexWrap: 'nowrap' }}>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, width: '250px', mt: '40px' }}>
            <Filter
              paramsState={paramsState}
              handleChangeParams={handleChangeParams}
              //   noRout={true}
              //   handleChangeArrayParams={handleChangeArrayParams}
              category="fragrance"
            />
          </Box>
          <Grid
            alignContent={'flex-start'}
            container
            sx={{
              flexGrow: 1,
              m: { xs: '25px 0 0 0', sm: '25px 0 0 0', md: '5px 0 0 40px' },
              //   position: 'relative',
            }}
            spacing={'30px'}
          >
            {loading && <CircularProgress sx={{ position: 'fixed', top: '50%', right: '50%' }} />}
            {Object.keys(data).map((key, index) => {
              return (
                <FragranceCard
                  key={key}
                  img={data[key].mainImage.file}
                  id={key}
                  brand={data[key].brand}
                  model={data[key].model}
                  size={data[key].size || 100}
                  price={data[key].price}
                />
              );
            })}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
              <FragrancePagination />
            </div>
          </Grid>
        </Grid>
        <Drawer
          sx={{ '& .MuiDrawer-paper': { width: '100%' } }}
          open={openDrawer}
          onClose={() => toggleDrawer(false)}
        >
          <div>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                bgcolor: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 6px',
                p: ' 10px 15px',
                zIndex: 100,
                alignItems: 'center',
              }}
            >
              <CloseIcon sx={{ color: '#8a8c8dff' }} onClick={() => toggleDrawer(false)} />
              <Button
                onClick={() => {
                  // toggleDrawer(false);
                  applyFilters(paramsState);
                }}
                variant="text"
                sx={{ m: 0 }}
              >
                Aply
              </Button>
            </Box>
            <div style={{ padding: '15px' }}>
              <Filter
                paramsState={paramsState}
                handleChangeParams={handleChangeParams}
                noRout={true}
                // handleChangeArrayParams={handleChangeArrayParams}
                category="fragrance"
              />
            </div>
          </div>
        </Drawer>
      </Box>
    </Grid>
  );
}
