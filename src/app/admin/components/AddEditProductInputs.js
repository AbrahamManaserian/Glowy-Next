'use client';

import styled from '@emotion/styled';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import NextImage from 'next/image';
import { useMemo } from 'react';

const inputsArray = [
  { key: 'brand', name: 'Brand' },
  { key: 'name', name: 'Name' },
  { key: 'coast', name: 'Coast', type: 'number' },
  { key: 'price', name: 'Price', type: 'number' },
  { key: 'disacountedPrice', name: 'Disacounted price', type: 'number' },
  { key: 'qouantity', name: 'Qouantity', type: 'number' },
  { key: 'supplier', name: 'Supplier' },
  { key: 'descriptionAm', name: 'Description Armenian' },
  { key: 'descriptionEn', name: 'Description English' },
  { key: 'descriptionRu', name: 'Description Russian' },
];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const fragranceBrands = [
  'Acqua di Parma',
  'Aesop',
  'Amouage',
  'Armani',
  'Bentley',
  'Bond No. 9',
  'Burberry',
  'Bvlgari',
  'Byredo',
  'Calvin Klein',
  'Carolina Herrera',
  'Cartier',
  'Chanel',
  'Chloé',
  'Clive Christian',
  'Creed',
  'Dior',
  'Diptyque',
  'Dolce & Gabbana',
  'Givenchy',
  'Guerlain',
  'Gucci',
  'Hermès',
  'Hugo Boss',
  'Initio Parfums Privés',
  'Jean Paul Gaultier',
  'Jo Malone London',
  'Kayali',
  'Kilian Paris',
  'Lancôme',
  'Le Labo',
  'Louis Vuitton',
  'Maison Francis Kurkdjian',
  'Maison Margiela',
  'Mancera',
  'Montale',
  'Montblanc',
  'Mugler',
  'Narciso Rodriguez',
  'Paco Rabanne',
  'Parfums de Marly',
  'Penhaligon’s',
  'Prada',
  'Tiffany & Co.',
  'Tiziana Terenzi',
  'Tom Ford',
  'Valentino',
  'Versace',
  'Yves Saint Laurent',
  'Zara',
];

export const categoriesObj = {
  fragrance: {
    category: 'Fragrance',
    fragrance: {
      category: 'Fragrance',
      brands: fragranceBrands,
      type: ['Men', 'Women', 'Uni'],
    },
    carFresheners: {
      category: 'Car Air Fresheners',
      type: [],
    },
    homeFresheners: {
      category: 'Home Air Fresheners',
      type: [],
    },
    deodorant: {
      category: 'Deodorant',
      type: [],
    },
  },

  makeup: {
    face: {
      category: 'Face',
      type: [
        'Foundation',
        'Highlighter',
        'Face Primer',
        'Powder & Setting Spray',
        'Contour',
        'Blush',
        'Concealer',
        'BB & CC cream',
      ],
    },

    eye: {
      category: 'Eye',
      type: ['Brow Gel', 'Eye Palettes', 'Eyebrow pencil', 'Eyeliner', 'Pencil'],
    },
    lip: {
      category: 'Lip',
      type: ['Lipstick', 'Liquid Lipstick', 'Lip Balm & Treatmentl', 'Lip Gloss', 'Lip Liner', 'Lip Oil'],
    },
    category: 'Makeup',
  },

  Skincare: {
    Cleansers: {
      Cleansers: 'cleansers',
      Exfoliation: 'exfoliation',
      'Face Wash': 'face-wash',
      'Makeup Removers': 'makeup-removers',
      'Toners & Lotions': 'toners-lotions',
      routTo: 'cleansers',
    },

    'Eye Care': {
      'Dark Circles': 'dark-circles',
      'Eye Patches': 'eye-patches',
      'Lifting/Anti-age Eye Creams': 'lifting-anti-age-eye-creams',
      routTo: 'eye-care',
    },
    Masks: {
      'Anti-age': 'anti-age',
      'Eye Patches': 'eye-patches',
      'Face Masks': 'face-masks',
      Hydrating: 'hydrating',
      routTo: 'masks',
    },
    Moisturizers: {
      'Face Creams': 'face-creams',
      'Face Oils': 'face-oils',
      Mists: 'mists',
      Moisturizers: 'moisturizers',
      'Night Creams': 'night-creams',
      'Anti-Aging': 'anti-aging',
      'Dark Spots': 'dark-spots',
      Lifting: 'lifting',
      'Face Serums': 'face-serums',
      routTo: 'masks',
    },
    routTo: 'moisturizers',
  },
  'Bath & Body': {
    'Bath & Shower': {
      Gel: 'gel',
      'Hand Wash & Soap': 'hand-wash-soap',
      'Scrub & Exfoliation': 'scrub-exfoliation',
      'Shampoo & Conditione': 'shampoo-conditione',
      routTo: 'bath-shower',
    },
    'Body Care': {
      Antiperspirants: 'antiperspirants',
      'Body Lotion & Body Oils': 'body-lotion-body-oils',
      'Body Moisturizers': 'body-moisturizers',
      'Cellulite & Stretch Marks': 'cellulite-stretch-marks',
      'Hand Cream & Foot Cream': 'hand-cream–foot-ream',
      'Masks & Special Treatment': 'masks-special-treatment',
      routTo: 'body-care',
    },
    routTo: 'bath-body',
  },
  Hair: {
    'Hair Styling': {
      Gel: 'gel',
      'Hand Wash & Soap': 'hand-wash-soap',
      'Scrub & Exfoliation': 'scrub-exfoliation',
      'Shampoo & Conditione': 'shampoo-conditione',
      routTo: 'hair-styling',
    },
    routTo: 'hair',
  },
  Nail: {
    Nail: {
      'Cuticle care': 'cuticle-care',
      'Nail care': 'nail-care',
      'Nail color': 'nail-color',
      'Nail polish removers': 'nail-polish-removers',
      routTo: 'nail',
    },
    routTo: 'nail',
  },
  'New Items': {
    'New Items': { routTo: 'new-items' },
    routTo: 'new-items',
  },
  Accessories: {
    Accessories: { routTo: 'accessories' },
    routTo: 'accessories',
  },
};

export default function AddEditProductInputs({
  data,
  inputs,
  setInputs,
  requiredFields,
  hadleChangeInputs,
  handleUploadMainImage,
  handleUploadImages,
  height,
  buttonText,
  handleClick,
}) {
  // console.log(inputs);

  const mainImage = useMemo(() => {
    if (inputs.mainImage) return URL.createObjectURL(inputs.mainImage.file);
  }, [inputs.mainImage]);

  const imagePreviews = useMemo(() => {
    return inputs.images.map((i) => URL.createObjectURL(i.file));
  }, [inputs.images]);
  return (
    <Grid
      sx={{
        maxWidth: '1150px',
        margin: '0 auto',
        flexWrap: 'wrap',
        overflow: 'hidden',
        mt: '40px',
        boxSizing: 'border-box',
        py: '10px',
      }}
      container
      size={12}
    >
      <FormControl
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
        }}
        size="small"
        error={!!requiredFields && !inputs.category}
      >
        <InputLabel>Category</InputLabel>
        <Select name="category" value={inputs.category} label="Category" onChange={hadleChangeInputs}>
          {Object.keys(categoriesObj).map((key, index) => {
            return (
              <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={key}>
                {categoriesObj[key].category}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{requiredFields && !inputs.category ? 'Required' : ' '}</FormHelperText>
      </FormControl>

      <FormControl
        error={!!requiredFields && !inputs.subCategory}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
        }}
        size="small"
      >
        <InputLabel>Sub category</InputLabel>
        <Select
          name="subCategory"
          disabled={inputs.category ? false : true}
          value={inputs.subCategory}
          label="Sub category"
          onChange={hadleChangeInputs}
        >
          {inputs.category &&
            Object.keys(categoriesObj[inputs.category]).map((key, index) => {
              if (key !== 'category') {
                return (
                  <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={key}>
                    {categoriesObj[inputs.category][key].category}
                  </MenuItem>
                );
              }
            })}
        </Select>
        <FormHelperText>{requiredFields && !inputs.subCategory ? 'Required' : ' '}</FormHelperText>
      </FormControl>

      <FormControl
        error={!!requiredFields && !inputs.type}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
        }}
        size="small"
      >
        <InputLabel>Type</InputLabel>
        <Select
          disabled={
            !inputs.subCategory || !categoriesObj[inputs.category][inputs.subCategory]?.type[0] ? true : false
          }
          value={inputs.type}
          label="Type"
          onChange={(e) => {
            // console.log(e.target.value);
            setInputs({ ...inputs, type: e.target.value });
          }}
        >
          {inputs.subCategory &&
            categoriesObj[inputs.category][inputs.subCategory]?.type.map((item, index) => {
              return (
                <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={item}>
                  {item}
                </MenuItem>
              );
            })}
        </Select>
        <FormHelperText>{requiredFields && !inputs.type.type ? 'Required' : ' '}</FormHelperText>
      </FormControl>

      {inputs.subCategory && (
        <>
          {inputsArray.map((item, index) => {
            // console.log(`${index}${item.key}`);
            if (item.key === 'supplier') {
              return (
                <FormControl
                  key={`${index}${item.key}`}
                  sx={{
                    boxSizing: 'border-box',
                    width: { xs: '100%', sm: 'calc(25% - 10px)' },
                  }}
                  size="small"
                >
                  <InputLabel>Select Suplier</InputLabel>
                  <Select
                    name="supplier"
                    value={inputs.supplier}
                    label="Select Suplier"
                    onChange={hadleChangeInputs}
                  >
                    {Object.keys(data.suppliers).map((key, index) => {
                      return (
                        <MenuItem
                          sx={{ textTransform: 'capitalize' }}
                          key={index}
                          value={data.suppliers[key].name}
                        >
                          {data.suppliers[key].name || 'No name'}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>{requiredFields && !inputs.supplier ? 'Required' : ' '}</FormHelperText>
                </FormControl>
              );
            } else if (item.key === 'brand') {
              return (
                <Autocomplete
                  key={`${index}${item.key}`}
                  sx={{
                    boxSizing: 'border-box',
                    width: { xs: '100%', sm: 'calc(25% - 10px)' },
                    mr: { xs: 0, sm: '10px' },
                  }}
                  size="small"
                  freeSolo
                  options={(categoriesObj?.[inputs.category]?.[inputs.subCategory]?.brands || []).map(
                    (option) => option
                  )}
                  renderInput={(params) => (
                    <TextField
                      helperText={requiredFields && !inputs.brand ? 'Required' : ' '}
                      {...params}
                      label="Brand"
                    />
                  )}
                  value={inputs.brand}
                  onBlur={(e) => {
                    setInputs({ ...inputs, brand: e.target.value });
                  }}
                />
              );
            } else {
              return (
                <TextField
                  multiline={item.key.includes('description') ? true : false}
                  type={item.type === 'number' ? 'number' : ''}
                  minRows={4}
                  key={`${index}-${item.key}-${inputs[item.key] ?? ''}`}
                  error={!!requiredFields && !inputs.name}
                  defaultValue={inputs[item.key]}
                  name={item.key}
                  onBlur={(e) => hadleChangeInputs(e)}
                  onChange={(e) => {
                    if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (item.type === 'number') {
                      if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }}
                  sx={{
                    boxSizing: 'border-box',
                    width: {
                      xs: '100%',
                      sm: item.key.includes('description') ? '100%' : 'calc(25% - 10px)',
                    },
                    mr: { xs: 0, sm: '10px' },
                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                      {
                        WebkitAppearance: 'none', // Chrome, Safari, Edge
                      },
                  }}
                  helperText={' '}
                  size="small"
                  label={item.name}
                  variant="outlined"
                />
              );
            }
          })}

          <div style={{ width: '100%' }}>
            <Button
              sx={{ textTransform: 'capitalize' }}
              component="label"
              role={undefined}
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload main image
              <VisuallyHiddenInput
                name="mainImage"
                accept="image/*"
                type="file"
                onChange={(e) => {
                  handleUploadMainImage(e);
                  e.target.value = '';
                }}
              />
            </Button>
          </div>

          <Typography
            color="error"
            sx={{
              visibility: requiredFields && !inputs.mainImage ? 'visible' : 'hidden',
              width: '100%',
              fontSize: '12px',
              // my: '3px',
            }}
          >
            Required
          </Typography>
          <Box
            sx={{
              position: 'relative',
              border: '1px solid #bdc5c9ff',
              width: { xs: '100%', sm: '250px' },
              height: { xs: `${height - 10}px`, sm: '250px' },
              p: '10px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              boxSizing: 'border-box',
            }}
          >
            {inputs.mainImage && (
              <>
                <CloseOutlinedIcon
                  onClick={() => setInputs({ ...inputs, mainImage: '', smallImage: '' })}
                  sx={{ bgcolor: 'red', position: 'absolute', top: 0, right: 0, color: 'white' }}
                />

                <NextImage
                  src={mainImage}
                  alt="Preview"
                  width={200}
                  height={200}
                  style={{
                    width: inputs.mainImage.height < inputs.mainImage.width ? '100%' : 'auto',
                    height: inputs.mainImage.height >= inputs.mainImage.width ? '100%' : 'auto',
                  }}
                />
              </>
            )}
          </Box>
          <div style={{ width: '100%', margin: '15px 0' }}>
            <Button
              sx={{ textTransform: 'capitalize' }}
              component="label"
              role={undefined}
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload images
              <VisuallyHiddenInput
                accept="image/*"
                type="file"
                onChange={(event) => {
                  handleUploadImages(event.target.files);
                  event.target.value = '';
                }}
                multiple
              />
            </Button>
          </div>

          <Grid size={12} container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((img, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    border: '1px solid #bdc5c9ff',
                    width: { xs: 'calc(50% - 10px)', sm: '150px' },
                    height: { xs: `${height / 2 - 10}px`, sm: '150px' },
                    // p: '10px',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    boxSizing: 'border-box',
                  }}
                >
                  {imagePreviews[index] && (
                    <CloseOutlinedIcon
                      onClick={() =>
                        setInputs({ ...inputs, images: inputs.images.filter((_, i) => i !== index) })
                      }
                      sx={{ bgcolor: 'red', position: 'absolute', top: 0, right: 0, color: 'white' }}
                    />
                  )}
                  {imagePreviews[index] && (
                    <NextImage
                      src={imagePreviews[index]}
                      alt="Preview"
                      width={200}
                      height={200}
                      style={{
                        width: inputs.images[index].height < inputs.images[index].width ? '100%' : 'auto',
                        height: inputs.images[index].height >= inputs.images[index].width ? '100%' : 'auto',
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Grid>
          <Button
            onClick={handleClick}
            color="success"
            sx={{ textTransform: 'capitalize', mt: '20px' }}
            variant="contained"
          >
            {buttonText}
          </Button>
        </>
      )}
    </Grid>
  );
}
