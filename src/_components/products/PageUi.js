'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Drawer, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SortView from './SortView';
import Filter from './Filter';
import PagePagination from './PagePagination';
import FragranceCart from '@/_components/carts/FragranceCart';

export default function PageUi({ data, categoryText, category }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(false);
  }, [data]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [paramsState, setParamsState] = useState({
    sortBy: '',
    size: '',
    view: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    subCategory: '',
    brand: '',
    inStock: 'noCheck',
  });

  const applyFilters = () => {
    setLoading(true);
    toggleDrawer(false);
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(paramsState).forEach((key) => {
      params.set(key, paramsState[key]);
    });

    router.push(`?${params.toString()}`);
  };

  const toggleDrawer = (newOpen) => {
    setOpenDrawer(newOpen);
  };

  const doRout = (prop, value) => {
    if (prop === 'type' || prop === 'subCategory' || prop === 'size' || prop === 'brand') {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      if (prop === 'subCategory') {
        params.set('type', '');
        params.set('brand', '');
        params.set('size', '');
      }
      params.set(prop, value);
      router.push(`?${params.toString()}`);
    }
  };

  const handleChangeParams = (prop, value, noRout) => {
    if (prop === 'subCategory') {
      setParamsState({ ...paramsState, [prop]: value, type: '', brand: '', size: '' });
    } else {
      setParamsState({ ...paramsState, [prop]: value });
    }
    if (!noRout) {
      doRout(prop, value);
    }
  };

  useEffect(() => {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    const newState = {};
    Object.keys(paramsState).forEach((key) => {
      newState[key] = searchParams.get(key) || '';
    });
    setParamsState(newState);
  }, [searchParams]);

  return (
    <Grid sx={{ m: { xs: '50px 10px', sm: '90px 35px' } }} size={12}>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            right: 'calc(50% - 20px)',
            width: '32px',
            height: '32px',
            border: '3px solid rgba(0, 0, 0, 0.1)',
            borderTop: '3px solid #2196f3',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            zIndex: 1000000,
          }}
        ></div>
      )}

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
              lineHeight: { xs: '18px', sm: '30px' },
              mb: '20px',
            }}
          >
            {categoryText}
          </Typography>

          <SortView
            toggleDrawer={toggleDrawer}
            handleChangeParams={handleChangeParams}
            paramsState={paramsState}
          />
        </Box>
        <Grid container sx={{ width: '100%', flexWrap: 'nowrap' }}>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, mt: '40px' }}>
            <Filter paramsState={paramsState} handleChangeParams={handleChangeParams} category={category} />
          </Box>
          <Grid
            alignContent={'flex-start'}
            container
            sx={{
              flexGrow: 1,
              m: { xs: '15px 0 0 0', sm: '25px 0 0 0', md: '0 0 0 40px' },
              minHeight: '60vh',
              position: 'relative',
            }}
            spacing={{ xs: '10px', sm: '20px' }}
          >
            <Typography
              sx={{
                width: '100%',

                fontSize: { xs: '10px', sm: '14px' },
                // lineHeight: '13px',
                color: '#54565afb',
                fontWeight: 200,
              }}
            >
              {paramsState.subCategory} {paramsState.type && ` > ${paramsState.type} `}
              {paramsState.brand && ` > ${paramsState.brand}  `}
              {paramsState.size && ` > Size - ${paramsState.size} `}
            </Typography>
            {loading && (
              <div
                style={{
                  position: 'absolute', // 👈 key difference — relative to the parent
                  inset: 0,
                  backdropFilter: 'blur(0.5px)',
                  background: 'rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px', // optional, matches parent if rounded
                  zIndex: 10,
                }}
              >
                <style jsx>{`
                  @keyframes spin {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
              </div>
            )}
            {Object.keys(data).map((key, index) => {
              return (
                <Grid key={index} size={{ xs: 6, sm: 4, md: 4, lg: 3 }}>
                  <FragranceCart item={data[key]} />
                </Grid>
              );
            })}
            {Object.keys(data).length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
                <PagePagination />
              </div>
            )}
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
                category={category}
              />
            </div>
          </div>
        </Drawer>
      </Box>
    </Grid>
  );
}
