'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Drawer, Grid, Pagination, PaginationItem, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SortView from './SortView';
import Filter, { typeMapping } from './Filter';
import ItemCart from '@/_components/carts/ItemCart';
import { categoriesObj } from '@/app/[locale]/(pages)/admin1/add-product/page';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useTranslations } from 'next-intl';

export const CustomPagination = ({ curentPage, currentPage, totalPages, handlePageChange }) => {
  // accept both `curentPage` (existing prop in codebase) and `currentPage`
  const current = typeof currentPage === 'number' ? currentPage : curentPage;

  const buildCompactPagination = (cur, total) => {
    if (!total || total <= 1) return [1];

    // Build a set of page numbers to show: 1, total, current, current-1, current+1 (when valid)
    const pagesSet = new Set([1, total, cur]);
    if (cur - 1 >= 2) pagesSet.add(cur - 1);
    if (cur + 1 <= total - 1) pagesSet.add(cur + 1);

    const nums = Array.from(pagesSet)
      .filter((n) => typeof n === 'number' && Number.isFinite(n))
      .sort((a, b) => a - b);

    // Insert '...' where there are numeric gaps
    const result = [];
    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      if (i === 0) {
        result.push(n);
        continue;
      }
      const prev = nums[i - 1];
      if (n === prev + 1) {
        result.push(n);
      } else {
        result.push('...');
        result.push(n);
      }
    }

    return result;
  };

  const items = buildCompactPagination(current, totalPages);

  return (
    <nav aria-label="Pagination" style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'center' }}>
      {items.map((p, i) => {
        if (p === '...') {
          return (
            <span key={`dots-${i}`} style={{ padding: '6px 10px', color: '#666' }} aria-hidden>
              …
            </span>
          );
        }

        const isActive = p === current;

        return (
          <button
            key={`page-${p}-${i}`}
            type="button"
            onClick={(e) => handlePageChange(e, p)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={isActive ? `Page ${p}, current` : `Go to page ${p}`}
            style={{
              WebkitTapHighlightColor: 'rgba(182, 212, 238, 0.69)',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 30,
              height: 30,
              borderRadius: '50%',
              border: isActive ? '1px solid #1976d2' : '1px solid #ddd',
              background: isActive ? '#1976d2' : 'white',
              color: isActive ? 'white' : '#1976d2',
              cursor: 'pointer',
            }}
          >
            {p}
          </button>
        );
      })}
    </nav>
  );
};

const defaultParams = {
  orderBy: '',
  size: '',
  view: '',
  minPrice: '',
  maxPrice: '',
  type: '',
  subCategory: '',
  brands: [],
  original: false,
  inStock: false,
  sale: false,
  page: '',
};

export default function PageUi({ data, categoryText, category, totalDocs, lastId, startId }) {
  const t = useTranslations('ShopPage');
  const tCommon = useTranslations('Common.nav');
  const tTypes = useTranslations('ProductTypes');
  const tCategories = useTranslations('Categories');
  const [loading, setLoading] = useState(false);
  // console.log(lastId, startId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [paramsState, setParamsState] = useState(defaultParams);

  const [brands, setBrands] = useState([]);

  const resetFilters = () => {
    setLoading(true);
    router.push(window.location.pathname);
  };

  const applyFilters = () => {
    setLoading(true);
    toggleDrawer(false);
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(paramsState).forEach((key) => {
      const value = paramsState[key];
      if (key === 'brands') {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else {
          params.delete(key);
        }
      } else if (key === 'original' || key === 'inStock' || key === 'sale') {
        if (value) {
          params.set(key, 'true');
        } else {
          params.delete(key);
        }
      } else if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete('page');
    params.delete('startId');
    params.delete('lastId');
    params.delete('nav');

    router.push(`?${params.toString()}`);
  };

  const toggleDrawer = (newOpen) => {
    setOpenDrawer(newOpen);
  };

  const doRout = (prop, value) => {
    if (
      [
        'type',
        'subCategory',
        'size',
        'brands',
        'page',
        'original',
        'inStock',
        'sale',
        'orderBy',
        'minPrice',
        'maxPrice',
      ].includes(prop)
    ) {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      if (prop === 'subCategory') {
        params.set('type', '');
        params.delete('brands');
        params.set('size', '');
      }
      if (prop !== 'page' && prop !== 'startId' && prop !== 'lastId') {
        params.delete('page');
        params.delete('startId');
        params.delete('lastId');
        params.delete('nav');
      }

      if (prop === 'brands') {
        if (Array.isArray(value) && value.length > 0) {
          params.set(prop, value.join(','));
        } else {
          params.delete(prop);
        }
      } else if (prop === 'original' || prop === 'inStock') {
        if (value) {
          params.set(prop, 'true');
        } else {
          params.delete(prop);
        }
      } else {
        if (value) params.set(prop, value);
        else params.delete(prop);
      }
      router.push(`?${params.toString()}`);
    }
  };

  const handleChangeParams = (prop, value, noRout) => {
    if (prop === 'subCategory') {
      setParamsState({
        ...paramsState,
        size: '',
        view: '',
        minPrice: '',
        maxPrice: '',
        type: '',
        subCategory: value,
        brands: [],
      });
    } else {
      // console.log(prop);
      setParamsState({ ...paramsState, [prop]: value });
    }
    if (!noRout) {
      doRout(prop, value);
    }
  };

  const handlePageChange = (e, value) => {
    if (value === +paramsState.page || (value === 1 && !paramsState.page)) return;
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 1) {
      params.delete('page');
      params.delete('startId');
      params.delete('lastId');
      params.delete('nav');
    } else if (value === Math.ceil(totalDocs / 10)) {
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
    const newState = { ...defaultParams };
    Object.keys(defaultParams).forEach((key) => {
      if (searchParams.has(key)) {
        let value = searchParams.get(key);
        let parsedValue = value;
        if (key === 'brands') {
          parsedValue = value ? value.split(',') : [];
        } else if (key === 'original' || key === 'inStock' || key === 'sale') {
          parsedValue = value !== 'false';
        } else {
          if (value === 'true') parsedValue = true;
          else if (value === 'false') parsedValue = false;
        }
        newState[key] = parsedValue;
      }
    });
    setParamsState(newState);
  }, [searchParams]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  useEffect(() => {
    if (category) {
      fetch(`/api/brands/${category}`)
        .then((res) => res.json())
        .then((data) => setBrands(data))
        .catch((err) => console.error('Error fetching brands:', err));
    }
  }, [category]);

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
            {tCommon(category)}
          </Typography>

          <SortView
            toggleDrawer={toggleDrawer}
            handleChangeParams={handleChangeParams}
            paramsState={paramsState}
          />
        </Box>
        <Button
          onClick={() => {
            toggleDrawer(false);
            resetFilters();
          }}
          variant="text"
          // color="success"
          sx={{ textTransform: 'initial', color: '#f44336' }}
          size="small"
        >
          {t('resetFilters')}
        </Button>
        <Grid container sx={{ width: '100%', flexWrap: 'nowrap' }}>
          <Box
            sx={{
              display: { xs: 'none', sm: 'none', md: 'flex' },
              mt: '40px',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <Filter
              paramsState={paramsState}
              handleChangeParams={handleChangeParams}
              category={category}
              noRout={true}
              brands={brands}
            />
            <Button
              variant="contained"
              onClick={() => {
                applyFilters(paramsState);
              }}
              sx={{
                position: 'sticky',
                width: { xs: '100%', sm: '250px' },
                zIndex: 10,
                bottom: 20,
                textTransform: 'initial',
                borderRadius: '10px',
              }}
            >
              {t('applyFilters')}
            </Button>
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
                fontSize: { xs: '12px', sm: '14px' },
                color: '#54565afb',
                fontWeight: 400,
                mb: '5px',
              }}
            >
              {tCommon(category)}
              {paramsState.subCategory && ` > ${tCategories(paramsState.subCategory)}`}
              {paramsState.type && ` > ${tTypes(typeMapping[paramsState.type])}`}
              {paramsState.brands &&
                paramsState.brands.length > 0 &&
                ` > ${t('brands')} - ${paramsState.brands.join(', ')}`}
              {paramsState.size && ` > ${t('size')} ${paramsState.size}`}
              {paramsState.sale && ` > ${t('sale')}`}
              {paramsState.original && ` > ${t('original')}`}
              {paramsState.inStock && ` > ${t('inStock')}`}
            </Typography>
            <Typography
              sx={{
                width: '100%',
                fontSize: { xs: '10px', sm: '12px' },
                color: '#7d7d7d',
                fontWeight: 300,
              }}
            >
              {t('totalItems')}: {totalDocs}
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
                  <ItemCart item={data[key]} />
                </Grid>
              );
            })}
            {Object.keys(data).length > 0 ? (
              // <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              <CustomPagination
                curentPage={+paramsState.page || 1}
                totalPages={Math.ceil(totalDocs / 10)}
                handlePageChange={handlePageChange}
              />
            ) : (
              // </div>
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
                  {t('noProducts')}
                </Typography>

                <Typography variant="body2" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                  {t('noProductsTry')}
                </Typography>

                <Button
                  onClick={resetFilters}
                  sx={{ ml: '10px', bgcolor: '#f44336', borderRadius: '10px', textTransform: 'initial' }}
                  variant="contained"
                >
                  {t('resetFilters')}
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
                  applyFilters(paramsState);
                }}
                variant="text"
                sx={{ textTransform: 'capitalize' }}
              >
                {t('applyFilters')}
              </Button>
            </Box>
            <div style={{ padding: '15px' }}>
              <Filter
                paramsState={paramsState}
                handleChangeParams={handleChangeParams}
                noRout={true}
                category={category}
                brands={brands}
              />
            </div>
          </div>
        </Drawer>
      </Box>
    </Grid>
  );
}
