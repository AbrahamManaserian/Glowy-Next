'use client';

import { Box, Button, Drawer, Grid, Pagination, Stack, Typography } from '@mui/material';
import { use, useEffect, useState } from 'react';
import Filter from './componenets/Filter';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SortView from './componenets/SortView';
import CloseIcon from '@mui/icons-material/Close';
import FragranceCard from './componenets/FragranceCard';
import { images } from '@/components/PopularProducts';
import FragrancePagination from './componenets/FragrancePagination';
// import Pagination from './componenets/Pagination';
// import { images } from '@/components/FlashDeals';

export default function FragrancePage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [paramsState, setParamsState] = useState({
    sortBy: '',
    view: '',
    minPrice: '',
    maxPrice: '',
    gender: [],
    category: [],
    brands: [],
    inStock: 'noCheck',
  });

  const toggleDrawer = (newOpen) => {
    setOpenDrawer(newOpen);
  };

  const applyFilters = (obj) => {
    toggleDrawer(false);
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(obj).forEach((key) => {
      if (key === 'gender' && key === 'category' && key === 'brands') {
        params.set(key, obj[key].join(','));
      } else {
        params.set(key, obj[key]);
      }
    });

    // sessionStorage.setItem('app-scroll:' + params.toString(), String(window.scrollY));
    router.push(`?${params.toString()}`);
  };

  const makeRout = (prop, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(prop, value);
    router.push(`?${params.toString()}`);
  };

  const makeArrayRoute = (prop, arr) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(prop, arr.join(','));
    router.push(`?${params.toString()}`);
  };

  const handleChangeArrayParams = (prop, value, rout) => {
    let items = [];
    if (value === 'clean') {
    } else if (paramsState[prop].includes(value)) {
      items = paramsState[prop].filter((f) => f !== value);
    } else {
      items = [...paramsState[prop], value];
    }
    const newState = { ...paramsState, [prop]: items };
    setParamsState(newState);
    if (rout) {
      makeArrayRoute(prop, items);
    }
  };

  const handleChangeParams = (prop, value, rout) => {
    setParamsState({ ...paramsState, [prop]: value });
    if (rout) {
      makeRout(prop, value);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    toggleDrawer(false);
    const newState = {};
    Object.keys(paramsState).forEach((key) => {
      if (key === 'gender' || key === 'category' || key === 'brands') {
        const items = searchParams.get(key);
        const arrItems = items ? items.split(',') : [];
        newState[key] = arrItems;
      } else {
        newState[key] = searchParams.get(key) || '';
      }
    });
    setParamsState(newState);
  }, [pathname, searchParams.toString()]);

  return (
    <Grid data-scroll-restoration-id="container" sx={{ m: { xs: '50px 15px', sm: '90px 35px' } }} size={12}>
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
              makeRout={true}
              handleChangeArrayParams={handleChangeArrayParams}
            />
          </Box>
          <Grid
            alignContent={'flex-start'}
            container
            sx={{ flexGrow: 1, m: { xs: '25px 0 0 0', sm: '25px 0 0 0', md: '5px 0 0 40px' } }}
            spacing={'30px'}
          >
            {images.map((img, index) => {
              return <FragranceCard key={index} img={img} name={index} id={index} />;
            })}
            {images.map((img, index) => {
              return <FragranceCard key={index} img={img} name={index} id={index} />;
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
                makeRout={false}
                handleChangeArrayParams={handleChangeArrayParams}
              />
            </div>
          </div>
        </Drawer>
      </Box>
    </Grid>
  );
}
