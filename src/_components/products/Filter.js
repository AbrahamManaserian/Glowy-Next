'use client';

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Checkbox,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import React, { useRef, useState, useEffect } from 'react';
import { categoriesObj } from '@/app/[locale]/(pages)/admin1/add-product/page';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';

const IOSSwitch = styled(({ color, prop, noRout, checked, handleChangeParams, ...props }) => (
  <Switch
    onChange={(e) => handleChangeParams(prop, e.target.checked, noRout)}
    checked={checked}
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(({ theme, color }) => ({
  width: 36,
  height: 20,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: color ? color : '#f44336',
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#bdbdc3ff',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

const FormItem = ({ prop, checked, value, name, noRout, handleChangeParams }) => {
  return (
    <FormControlLabel
      sx={{
        '& .MuiFormControlLabel-label': {
          fontSize: '14px',
          color: '#263045e9',
        },
      }}
      control={
        <Checkbox
          size="small"
          sx={{
            borderRadius: '15px',
            '&.Mui-checked': {
              color: '#e54e36ff',
            },
          }}
          checked={checked}
          onChange={(e) => {
            if (!e.target.checked) {
              handleChangeParams(prop, '', noRout);
            } else {
              handleChangeParams(prop, value, noRout);
            }
          }}
        />
      }
      label={name}
    />
  );
};

const textFieldStyle = {
  width: '120px',
  '& .MuiOutlinedInput-root': {
    height: '40px',
    fontSize: '14px',
    backgroundColor: '#276ddd0e',
    borderRadius: '8px',
    padding: '0 20px',
    '& fieldset': {
      border: '1px solid #ffffffff',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #030303dd',
    },
    '& input[type=number]': {
      MozAppearance: 'textfield', // Firefox
    },
    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
      WebkitAppearance: 'none', // Chrome, Safari, Edge
      margin: 0,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: 0, // remove default padding
  },
};

const ColllapseItem = ({ prop, name, open, handleCangeCollapse }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '10px' }}>
      <Typography sx={{ color: '#263045fb', fontWeight: 500 }}> {name} </Typography>
      {open ? (
        <RemoveOutlinedIcon
          onClick={() => handleCangeCollapse(prop, false)}
          sx={{ color: '#263045fb', cursor: 'pointer' }}
        />
      ) : (
        <AddOutlinedIcon
          onClick={() => handleCangeCollapse(prop, true)}
          sx={{ color: '#263045fb', cursor: 'pointer' }}
        />
      )}
    </Box>
  );
};

import { Link } from '@/i18n/routing';
export const typeMapping = {
  Men: 'men',
  Women: 'women',
  Uni: 'uni',
  Foundation: 'foundation',
  Highlighter: 'highlighter',
  'Face Primer': 'facePrimer',
  'Powder & Setting Spray': 'powderSettingSpray',
  Contour: 'contour',
  Blush: 'blush',
  Concealer: 'concealer',
  'BB & CC cream': 'bbCcCream',
  'Brow Gel': 'browGel',
  'Eye Palettes': 'eyePalettes',
  'Eyebrow pencil': 'eyebrowPencil',
  Eyeliner: 'eyeliner',
  Pencil: 'pencil',
  Lipstick: 'lipstick',
  'Liquid Lipstick': 'liquidLipstick',
  'Lip Balm & Treatmentl': 'lipBalmTreatmentl',
  'Lip Gloss': 'lipGloss',
  'Lip Liner': 'lipLiner',
  'Lip Oil': 'lipOil',
  Cleansers: 'cleansers',
  Exfoliation: 'exfoliation',
  'Face Wash': 'faceWash',
  'Makeup Removers': 'makeupRemovers',
  'Toners & Lotions': 'tonersLotions',
  'Dark Circles': 'darkCircles',
  'Eye Patches': 'eyePatches',
  'Lifting/Anti-age Eye Creams': 'liftingAntiAgeEyeCreams',
  'Anti-age': 'antiAge',
  'Face Masks': 'faceMasks',
  Hydrating: 'hydrating',
  'Face Serums': 'faceSerums',
  'Face Creams': 'faceCreams',
  'Face Oils': 'faceOils',
  Mists: 'mists',
  Moisturizers: 'moisturizers',
  'Night Creams': 'nightCreams',
  'Anti-Aging': 'antiAging',
  'Dark Spots': 'darkSpots',
  Lifting: 'lifting',
  Gel: 'gel',
  'Hand Wash & Soap': 'handWashSoap',
  'Scrub & Exfoliation': 'scrubExfoliation',
  'Shampoo & Conditione': 'shampooConditione',
  Antiperspirants: 'antiperspirants',
  'Body Lotion & Body Oils': 'bodyLotionBodyOils',
  'Body Moisturizers': 'bodyMoisturizers',
  'Cellulite & Stretch Marks': 'celluliteStretchMarks',
  'Hand Cream & Foot Cream': 'handCreamFootCream',
  'Masks & Special Treatment': 'masksSpecialTreatment',
  'Cuticle care': 'cuticleCare',
  'Nail care': 'nailCare',
  'Nail color': 'nailColor',
  'Nail polish removers': 'nailPolishRemovers',
  Fragrance: 'fragrance',
  Makeup: 'makeup',
  Skincare: 'skincare',
};

export default function Filter({ paramsState, handleChangeParams, noRout, category, brands, sizes }) {
  const t = useTranslations('ShopPage');
  const tCommon = useTranslations('Common.nav');
  const tCategories = useTranslations('Categories');
  const tProductTypes = useTranslations('ProductTypes');
  const inputRef = useRef(null);
  const initialValue = useRef('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [brandsDialogOpen, setBrandsDialogOpen] = useState(false);

  const [dialogAutoOpen, setDialogAutoOpen] = useState(false);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [sizesDialogOpen, setSizesDialogOpen] = useState(false);
  const [sizesAutocompleteOpen, setSizesAutocompleteOpen] = useState(false);
  const sizesInputRef = useRef(null);

  useEffect(() => {
    if (brandsDialogOpen) {
      setDialogAutoOpen(true);
    } else {
      setDialogAutoOpen(false);
    }
  }, [brandsDialogOpen]);

  const [collapseItems, setCollapseItems] = useState({
    type: true,
    category: true,
    price: true,
    brands: true,
  });

  const handleCangeCollapse = (key, value) => {
    setCollapseItems({ ...collapseItems, [key]: value });
  };

  if (category === 'shop' || category === 'sale') {
    return (
      <Grid container sx={{ width: { xs: '100%', sm: '250px' } }} direction={'column'}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {t('categories')}
        </Typography>
        {Object.entries(categoriesObj).map(([key, value]) => (
          <Link
            key={key}
            href={`/${key}${category === 'sale' ? '?sale=true' : ''}`}
            className="bar-link"
            style={{ display: 'block', marginBottom: '4px' }}
          >
            {tCommon(key)}
          </Link>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container sx={{ width: { xs: '100%', sm: '250px' }, pb: '200px' }} direction={'column'}>
      <ColllapseItem
        prop="price"
        name={t('price')}
        open={collapseItems.price}
        handleCangeCollapse={handleCangeCollapse}
      />
      <Collapse in={collapseItems.price} timeout="auto" unmountOnExit>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', m: '10px 0 20px 0' }}>
          <TextField
            key={`minPrice${paramsState.minPrice}`}
            type="number"
            placeholder={t('minPrice')}
            defaultValue={paramsState.minPrice}
            onFocus={(e) => (initialValue.current = e.target.value)}
            onBlur={(e) => {
              if (initialValue.current !== e.target.value) {
                handleChangeParams('minPrice', e.target.value, noRout);
              }
            }}
            variant="outlined"
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            sx={textFieldStyle}
            helperText={t('minPriceAMD')}
          />
          <TextField
            key={`maxPrice${paramsState.maxPrice}`}
            type="number"
            placeholder={t('maxPrice')}
            variant="outlined"
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            defaultValue={paramsState.maxPrice}
            onFocus={(e) => (initialValue.current = e.target.value)}
            onBlur={(e) => {
              if (initialValue.current !== e.target.value) {
                handleChangeParams('maxPrice', e.target.value, noRout);
              }
            }}
            sx={textFieldStyle}
            helperText={t('maxPriceAMD')}
          />
        </Box>
      </Collapse>
      <Box sx={{ display: 'flex', mt: '5px', alignItems: 'center' }}>
        <IOSSwitch
          prop="sale"
          handleChangeParams={handleChangeParams}
          checked={paramsState.sale}
          noRout={noRout}
          color="green"
        />

        <Typography sx={{ color: '#263045fb', fontWeight: 500, ml: '15px' }}>
          {t('discountedProducts')}
        </Typography>
      </Box>
      <Typography
        sx={{
          color: '#263045fb',
          fontSize: '12px',
          ml: '51px',
          mb: '15px',
          fontWeight: 400,
        }}
      >
        {t('showDiscountedOnly')}
      </Typography>

      <ColllapseItem
        prop="category"
        name={t('categories')}
        open={collapseItems.category}
        handleCangeCollapse={handleCangeCollapse}
      />
      <Collapse in={collapseItems.category} timeout="auto" unmountOnExit>
        <FormGroup sx={{ pl: '8px', mb: '5px' }}>
          {Object.keys(categoriesObj[category]).map((key, index) => {
            if (key !== 'category') {
              return (
                <FormItem
                  key={index}
                  handleChangeParams={handleChangeParams}
                  checked={paramsState.subCategory === key}
                  name={tCategories(key)}
                  value={key}
                  noRout={noRout}
                  prop="subCategory"
                />
              );
            }
          })}
        </FormGroup>
      </Collapse>

      <ColllapseItem
        prop="type"
        name={t('type')}
        open={collapseItems.type}
        handleCangeCollapse={handleCangeCollapse}
      />
      <Collapse in={collapseItems.type} timeout="auto" unmountOnExit>
        {paramsState.subCategory && (
          <FormGroup sx={{ pl: '8px', mb: '5px' }}>
            {categoriesObj[category][paramsState.subCategory].type.map((name, index) => {
              return (
                <FormItem
                  key={index}
                  array={paramsState.type}
                  prop="type"
                  name={tProductTypes(typeMapping[name] || name)}
                  value={name}
                  handleChangeParams={handleChangeParams}
                  checked={paramsState.type === name}
                  noRout={noRout}
                />
              );
            })}
          </FormGroup>
        )}
      </Collapse>

      <ColllapseItem
        prop="brands"
        name={t('brands')}
        open={collapseItems.brands}
        handleCangeCollapse={handleCangeCollapse}
      />
      <Collapse in={collapseItems.brands} timeout="auto" unmountOnExit>
        <Autocomplete
          multiple
          disablePortal
          blurOnSelect
          sx={{ boxSizing: 'border-box', width: '100%', my: '10px' }}
          size="small"
          options={brands}
          filterOptions={(options, { inputValue }) => {
            const normalize = (str) =>
              str.toLowerCase().replace(/k/g, 'c').replace(/ph/g, 'f').replace(/qu/g, 'k');
            const isSubsequence = (input, option) => {
              if (input.length === 0) return true;
              let i = 0;
              for (let char of option) {
                if (char === input[i]) i++;
                if (i === input.length) return true;
              }
              return false;
            };
            return options.filter((option) => isSubsequence(normalize(inputValue), normalize(option)));
          }}
          // On mobile, open a dialog instead of the native popup
          onOpen={() => {
            if (isMobile) {
              setBrandsDialogOpen(true);
            } else {
              setAutocompleteOpen(true);
            }
          }}
          onClose={() => setAutocompleteOpen(false)}
          open={isMobile ? false : autocompleteOpen}
          renderInput={(params) => (
            <TextField
              inputRef={inputRef}
              {...params}
              label={t('brands')}
              onFocus={() => {
                if (isMobile) setBrandsDialogOpen(true);
              }}
            />
          )}
          value={paramsState.brands || []}
          onChange={(event, value) => {
            handleChangeParams('brands', value, noRout);
          }}
        />

        {/* Mobile dialog for brands selector */}
        <Dialog
          open={brandsDialogOpen}
          onClose={() => setBrandsDialogOpen(false)}
          fullWidth
          maxWidth={false}
          PaperProps={{
            sx: {
              width: '100vw',
              height: '100vh',
              margin: 0,
              maxWidth: '90vw',
              maxHeight: '95vh',
            },
          }}
        >
          <DialogContent
            sx={{
              padding: '0 15px',

              '& .MuiAutocomplete-popper .MuiPaper-root': {
                marginTop: '10px',
                boxShadow: 'none',
                border: 'none',
                borderRadius: 0,
                backgroundColor: 'transparent',
              },
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0 0 10px',
                alignItems: 'center',
              }}
            >
              <Typography>{t('brands')}</Typography>
              <IconButton
                onClick={() => setBrandsDialogOpen(false)}
                aria-label="close"
                // sx={{ position: 'relative', float: 'right' }}
              >
                <CloseIcon />
              </IconButton>
            </div>

            <Autocomplete
              multiple
              disablePortal
              blurOnSelect
              sx={{ width: '100%', mt: '10px' }}
              size="small"
              options={brands}
              ListboxProps={{
                style: {
                  maxHeight: 'none',
                  height: 'calc(100vh - 220px)',
                  overflow: 'auto',
                  paddingLeft: '3px',
                  border: 'none',
                },
              }}
              open={brandsDialogOpen}
              filterOptions={(options, { inputValue }) => {
                const normalize = (str) =>
                  str.toLowerCase().replace(/k/g, 'c').replace(/ph/g, 'f').replace(/qu/g, 'k');
                const isSubsequence = (input, option) => {
                  if (input.length === 0) return true;
                  let i = 0;
                  for (let char of option) {
                    if (char === input[i]) i++;
                    if (i === input.length) return true;
                  }
                  return false;
                };
                return options.filter((option) => isSubsequence(normalize(inputValue), normalize(option)));
              }}
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                  <li key={key} {...rest} style={{ paddingLeft: 0 }}>
                    {option}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} label={t('brands')} />}
              value={paramsState.brands || []}
              onChange={(event, value) => {
                handleChangeParams('brands', value, noRout);
              }}
            />
          </DialogContent>
        </Dialog>
      </Collapse>

      <Box sx={{ display: 'flex', my: '15px', flexWrap: 'wrap' }}>
        <Typography sx={{ color: '#263045fb', fontWeight: 500, mb: '15px' }}> {t('size')} </Typography>

        <Autocomplete
          multiple
          disablePortal
          blurOnSelect
          sx={{ boxSizing: 'border-box', width: '100%', my: '10px' }}
          size="small"
          options={sizes}
          onOpen={() => {
            if (isMobile) {
              setSizesDialogOpen(true);
            } else {
              setSizesAutocompleteOpen(true);
            }
          }}
          onClose={() => setSizesAutocompleteOpen(false)}
          open={isMobile ? false : sizesAutocompleteOpen}
          renderInput={(params) => (
            <TextField
              inputRef={sizesInputRef}
              {...params}
              label={t('size')}
              onFocus={() => {
                if (isMobile) setSizesDialogOpen(true);
              }}
            />
          )}
          value={paramsState.size || []}
          onChange={(event, value) => {
            handleChangeParams('size', value, noRout);
          }}
        />
      </Box>
      {sizesDialogOpen && (
        <Dialog
          open={sizesDialogOpen}
          onClose={() => setSizesDialogOpen(false)}
          fullWidth
          PaperProps={{
            sx: {
              width: '100vw',
              height: '100vh',
              margin: 0,
              maxWidth: '90vw',
              maxHeight: '95vh',
            },
          }}
        >
          <DialogContent sx={{ p: '0 15px', postion: 'relative' }}>
            <div
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0 0 10px',
                alignItems: 'center',
              }}
            >
              <Typography>{t('size')}</Typography>
              <IconButton onClick={() => setSizesDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </div>
            <Autocomplete
              multiple
              disablePortal
              blurOnSelect
              open={sizesDialogOpen}
              sx={{ width: '100%', mt: '10px' }}
              size="small"
              options={sizes}
              renderInput={(params) => <TextField inputRef={sizesInputRef} {...params} label={t('size')} />}
              value={paramsState.size || []}
              onChange={(event, value) => {
                handleChangeParams('size', value, noRout);
              }}
              ListboxProps={{
                sx: {
                  maxHeight: 'calc(100vh - 200px)',
                },
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      <Box sx={{ display: 'flex', mt: '5px', alignItems: 'center' }}>
        <IOSSwitch
          prop="original"
          handleChangeParams={handleChangeParams}
          checked={paramsState.original === true}
          noRout={noRout}
          color="#1976d2"
        />

        <Typography
          sx={{
            color: '#263045fb',
            fontWeight: 500,
            ml: '15px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {t('originalBrand')}
          <VerifiedIcon sx={{ fontSize: '18px', ml: '8px', color: '#1976d2' }} />
        </Typography>
      </Box>
      <Typography
        sx={{
          color: '#263045fb',
          fontSize: '12px',
          ml: '51px',
          mb: '15px',
          fontWeight: 400,
        }}
      >
        {t('showOriginalOnly')}
      </Typography>
      <Box sx={{ display: 'flex', mt: '5px' }}>
        <IOSSwitch
          prop="inStock"
          handleChangeParams={handleChangeParams}
          checked={paramsState.inStock}
          noRout={noRout}
        />

        <Typography sx={{ color: '#263045fb', fontWeight: 500, ml: '15px' }}>{t('onlyInStock')}</Typography>
      </Box>
      <Typography
        sx={{
          color: '#263045fb',
          fontSize: '12px',
          ml: '51px',
          mt: '5px',
          fontWeight: 400,
        }}
      >
        {t('showInStockOnly')}
      </Typography>
    </Grid>
  );
}
