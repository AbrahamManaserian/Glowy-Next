'use client';

import styled from '@emotion/styled';
import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import NextImage from 'next/image';
import { useMemo, useState } from 'react';

const availableOptionKeys = {
  color: { name: 'Color' },
  size: { name: 'Size' },
  number: { name: 'Number' },
  other: { name: 'Other' },
};

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

const unitOptions = [
  { label: 'Milliliters (ml)', value: 'ml' },
  { label: 'Liters (L)', value: 'L' },
  { label: 'Grams (g)', value: 'g' },
  { label: 'Kilograms (kg)', value: 'kg' },
];

const descriptionInputsArray = [
  { key: 'descriptionAm', name: 'Description Armenian' },
  { key: 'descriptionEn', name: 'Description English' },
  { key: 'descriptionRu', name: 'Description Russian' },
];

const inputsArray = [
  { key: 'brand', name: 'Brand' },
  { key: 'model', name: 'Model' },
  { key: 'name', name: 'Name' },
  { key: 'size', name: 'Size', type: 'number', marginRight: '5px' },
  { key: 'unit', name: 'Unit', type: 'number', marginLeft: '5px' },
  { key: 'coast', name: 'Coast', type: 'number', marginRight: '5px' },
  { key: 'price', name: 'Price', type: 'number', marginLeft: '5px' },
  { key: 'disacountedPrice', name: 'Disacounted price', type: 'number', marginRight: '5px' },
  { key: 'qouantity', name: 'Qouantity', type: 'number', marginLeft: '5px' },
  { key: 'supplier', name: 'Supplier' },
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
  addMoreOption,
  requiredOption,
}) {
  const [open, setOpen] = useState(false);

  const deleteOption = (index) => {
    const filteredOptions = inputs.availableOptions.filter((item, i) => i !== index);
    setInputs({ ...inputs, availableOptions: filteredOptions });
  };

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
          mb: '15px',
        }}
        size="small"
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
      </FormControl>

      <FormControl
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
          mb: '15px',
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
      </FormControl>

      <FormControl
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
          mb: '15px',
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
        {/* <FormHelperText> </FormHelperText> */}
      </FormControl>

      <>
        {inputsArray.map((item, index) => {
          if (item.key === 'supplier') {
            return (
              <FormControl
                key={`${index}${item.key}`}
                sx={{
                  boxSizing: 'border-box',
                  width: { xs: '100%', sm: 'calc(25% - 10px)' },
                  mb: '15px',
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
                  mb: '15px',
                }}
                size="small"
                freeSolo
                options={(categoriesObj?.[inputs.category]?.[inputs.subCategory]?.brands || []).map(
                  (option) => option
                )}
                renderInput={(params) => <TextField name={item.key} {...params} label="Brand" />}
                value={inputs.brand}
                onBlur={(e) => {
                  hadleChangeInputs(e);
                }}
              />
            );
          } else if (item.key === 'name') {
            return (
              <TextField
                key={`${index}-${item.key}-${inputs[item.key] ?? ''}`}
                value={`${inputs.brand} - ${inputs.model}`}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                sx={{
                  boxSizing: 'border-box',
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 10px)',
                  },
                  mr: { xs: 0, sm: '10px' },
                  mb: '15px',
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                    {
                      WebkitAppearance: 'none', // Chrome, Safari, Edge
                    },
                }}
                size="small"
                label="Name"
                variant="outlined"
              />
            );
          } else if (item.key === 'unit') {
            return (
              <FormControl
                sx={{
                  boxSizing: 'border-box',
                  width: { xs: 'calc(50% - 5px)', sm: 'calc(12.5% - 10px)' },
                  mr: { xs: 0, sm: '10px' },
                  ml: { xs: '5px', sm: 0 },
                  mb: '15px',
                }}
                size="small"
                key={`${index}-${item.key}-${inputs[item.key] ?? ''}`}
              >
                <InputLabel>Unit</InputLabel>
                <Select name="unit" value={inputs.unit} label="Unit" onChange={hadleChangeInputs}>
                  {unitOptions.map((option, index) => {
                    return (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            );
          } else {
            return (
              <TextField
                type={item.type === 'number' ? 'number' : ''}
                key={`${index}-${item.key}-${inputs[item.key] ?? ''}`}
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
                    xs: item.type ? 'calc(50% - 5px)' : '100%',
                    sm: item.type ? 'calc(12.5% - 10px)' : 'calc(25% - 10px)',
                  },
                  mr: { xs: item.marginRight || '', sm: '10px' },
                  ml: { xs: item.marginLeft || '', sm: 0 },
                  mb: '15px',
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                    {
                      WebkitAppearance: 'none', // Chrome, Safari, Edge
                    },
                }}
                helperText={item.key === 'name' && requiredFields ? 'Required' : ''}
                size="small"
                label={`${item.name}${item.key === 'name' ? ' *' : ''}`}
                variant="outlined"
              />
            );
          }
        })}
      </>
      <div style={{ width: '100%' }}>
        <Button
          sx={{ textTransform: 'capitalize', mb: '10px' }}
          color="secondary"
          endIcon={open ? <RemoveIcon /> : <AddIcon />}
          onClick={() => setOpen(!open)}
        >
          More options
        </Button>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <FormControl
            sx={{
              boxSizing: 'border-box',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: '5px', sm: '10px' },
              // mb: '15px',
            }}
            size="small"
            error={!inputs.optionKey && requiredOption ? true : false}
          >
            <InputLabel>Option key</InputLabel>
            <Select name="optionKey" value={inputs.optionKey} label="Option key" onChange={hadleChangeInputs}>
              {Object.keys(availableOptionKeys).map((key, index) => {
                return (
                  <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={key}>
                    {availableOptionKeys[key].name}
                  </MenuItem>
                );
              })}
            </Select>

            <FormHelperText> {!inputs.optionKey && requiredOption ? 'Required' : ' '}</FormHelperText>
          </FormControl>

          <TextField
            key={`optionValue ${inputs.optionValue}`}
            defaultValue={inputs.optionValue}
            name="optionValue"
            onBlur={(e) => hadleChangeInputs(e)}
            onChange={(e) => {
              if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                setInputs({ ...inputs, optionValue: e.target.value });
              }
            }}
            sx={{
              boxSizing: 'border-box',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: 0, sm: '10px' },
              // mb: '15px',
              ml: { xs: '5px', sm: 0 },
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none', // Chrome, Safari, Edge
                },
            }}
            size="small"
            label="Option value"
            variant="outlined"
            error={!inputs.optionValue && requiredOption ? true : false}
            helperText={!inputs.optionValue && requiredOption ? 'Required' : ' '}
          />

          <TextField
            key={`${inputs.optionPrice}`}
            defaultValue={inputs.optionPrice}
            type="number"
            name="optionPrice"
            onBlur={(e) => hadleChangeInputs(e)}
            onChange={(e) => {
              if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                setInputs({ ...inputs, optionPrice: e.target.value });
              }
            }}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            sx={{
              boxSizing: 'border-box',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: 0, sm: '10px' },

              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none', // Chrome, Safari, Edge
                },
            }}
            size="small"
            label="Price"
            variant="outlined"
            error={!inputs.optionPrice && requiredOption ? true : false}
            helperText={!inputs.optionPrice && requiredOption ? 'Required' : ' '}
          />

          <Button
            onClick={addMoreOption}
            variant="contained"
            color="success"
            sx={{
              textTransform: 'capitalize',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: 0, sm: '10px' },

              ml: { xs: '10px', sm: 0 },
            }}
          >
            Add option
          </Button>
          <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 5px 10px 5px' }}>
            <Typography sx={{ width: '100%' }}>Added Available Options</Typography>
            {inputs.availableOptions.map((item, index) => {
              return (
                <div
                  style={{
                    border: 'solid 0.5px',
                    padding: '20px',
                    margin: '5px',
                    position: 'relative',
                    borderRadius: '5px',
                    overflow: 'hidden',
                  }}
                  key={index}
                >
                  <ClearIcon
                    onClick={() => deleteOption(index)}
                    sx={{ position: 'absolute', top: 0, right: 0, color: 'white', bgcolor: 'red' }}
                  />
                  <Typography>
                    {availableOptionKeys[item.optionKey].name} - {item.optionValue}
                  </Typography>
                </div>
              );
            })}
          </div>
        </Collapse>
      </div>
      <>
        {descriptionInputsArray.map((item, index) => {
          return (
            <TextField
              multiline={true}
              minRows={4}
              key={`${index}-${item.key}-${inputs[item.key] ?? ''}`}
              defaultValue={inputs[item.key]}
              name={item.key}
              onBlur={(e) => hadleChangeInputs(e)}
              onChange={(e) => {
                if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                  setInputs({ ...inputs, [e.target.name]: e.target.value });
                }
              }}
              sx={{
                boxSizing: 'border-box',
                width: {
                  xs: item.type ? 'calc(50% - 5px)' : '100%',
                  sm: '100%',
                },
                mr: { xs: 0, sm: '10px' },
                mb: '15px',
                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                  {
                    WebkitAppearance: 'none', // Chrome, Safari, Edge
                  },
              }}
              size="small"
              label={item.name}
              variant="outlined"
            />
          );
        })}
      </>
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
    </Grid>
  );
}
