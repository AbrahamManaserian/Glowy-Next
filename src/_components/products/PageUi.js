'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Drawer, Grid, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SortView from './SortView';
import Filter from './Filter';
import FragranceCart from '@/_components/carts/FragranceCart';
import { categoriesObj } from '@/app/admin/add-product/page';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function PageUi({ data, categoryText, category, totalDocs, lastId, startId }) {
  const [loading, setLoading] = useState(false);
  // console.log(lastId, startId);
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

  const resetFilters = () => {
    setLoading(true);
    router.push(window.location.pathname);
  };

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
    if (prop === 'type' || prop === 'subCategory' || prop === 'size' || prop === 'brand' || prop === 'page') {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      if (prop === 'subCategory') {
        params.set('type', '');
        params.set('brand', '');
        params.set('size', '');
      }
      if (prop !== 'page' || prop !== 'startId' || prop !== 'lastId') {
        params.delete('page');
        params.delete('startId');
        params.delete('lastId');
        params.delete('nav');
      }

      params.set(prop, value);
      router.push(`?${params.toString()}`);
    }
  };

  const handleChangeParams = (prop, value, noRout) => {
    // console.log('asd');
    if (prop === 'subCategory') {
      setParamsState({
        sortBy: '',
        size: '',
        view: '',
        minPrice: '',
        maxPrice: '',
        type: '',
        subCategory: value,
        brand: '',
        inStock: 'noCheck',
      });
    } else {
      setParamsState({ ...paramsState, [prop]: value });
    }
    if (!noRout) {
      doRout(prop, value);
    }
  };

  const handlePageChange = (e, value) => {
    if (value === +paramsState.page) return;
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 1) {
      params.delete('page');
      params.delete('startId');
      params.delete('lastId');
      params.delete('nav');
    } else if (value === Math.ceil(totalDocs / 4)) {
      params.set('page', value);
      params.set('startId', startId);
      params.set('lastId', lastId);
      params.set('nav', 'last');
    } else {
      params.set('page', value);
      params.set('startId', startId);
      params.set('lastId', lastId);
      if (value > paramsState.page || !paramsState.page) {
        params.set('nav', 'next');
      } else {
        params.set('nav', 'prev');
      }
    }

    setParamsState({ ...paramsState, page: value });
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    const newState = {};
    Object.keys(paramsState).forEach((key) => {
      newState[key] = searchParams.get(key) || '';
    });
    if (searchParams.get('page')) {
      newState.page = searchParams.get('page');
    }
    setParamsState(newState);
  }, [searchParams]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  return (
    <Grid sx={{ m: { xs: '50px 10px', sm: '90px 35px' } }} size={12}>
      {totalDocs}
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
              {paramsState.subCategory && categoriesObj[category][paramsState.subCategory].category}{' '}
              {paramsState.type && ` > ${paramsState.type} `}
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
            {Object.keys(data).length > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
                <Pagination
                  boundaryCount={1}
                  siblingCount={1}
                  color="primary"
                  count={Math.ceil(totalDocs / 4)}
                  page={+paramsState.page || 1}
                  onChange={handlePageChange}
                />
              </div>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  py: 6,
                  px: 2,
                  color: 'text.secondary',
                }}
              >
                <SearchOffIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  No products found
                </Typography>

                <Typography variant="body2" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                  Try adjusting your filters or explore other categories.
                </Typography>

                <Button
                  onClick={resetFilters}
                  sx={{ ml: '10px', bgcolor: '#f44336', borderRadius: '10px', textTransform: 'initial' }}
                  variant="contained"
                >
                  Reset Filters
                </Button>
              </Box>
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
