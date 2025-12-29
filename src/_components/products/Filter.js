'use client';

import {
  Autocomplete,
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Grid,
  Popper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import React, { useRef, useState } from 'react';
import { categoriesObj } from '@/app/(pages)/admin1/add-product/page';
import styled from '@emotion/styled';

function BottomPopper(props) {
  return <Popper {...props} placement="bottom-start" />;
}

const IOSSwitch = styled(({ noRout, checked, handleChangeParams, ...props }) => (
  <Switch
    onChange={(e) => handleChangeParams('inStock', e.target.checked ? 'check' : '', noRout)}
    checked={checked}
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(({ theme }) => ({
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
        backgroundColor: '#f44336',
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

import Link from 'next/link';

export default function Filter({ paramsState, handleChangeParams, noRout, category }) {
  const inputRef = useRef(null);
  const [brand, setBrand] = useState(paramsState.brand);
  const initialValue = useRef('');

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
          Categories
        </Typography>
        {Object.entries(categoriesObj).map(([key, value]) => (
          <Link
            key={key}
            href={`/${key}${category === 'sale' ? '?sale=true' : ''}`}
            className="bar-link"
            style={{ display: 'block', marginBottom: '4px' }}
          >
            {value.category}
          </Link>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container sx={{ width: { xs: '100%', sm: '250px' } }} direction={'column'}>
      <ColllapseItem
        prop="price"
        name="Price"
        open={collapseItems.price}
        handleCangeCollapse={handleCangeCollapse}
      />
      <Collapse in={collapseItems.price} timeout="auto" unmountOnExit>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '10px' }}>
          <TextField
            key={`minPrice${paramsState.minPrice}`}
            type="number"
            placeholder="Min price"
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
            helperText="Min Price AMD"
          />
          <TextField
            key={`maxPrice${paramsState.maxPrice}`}
            type="number"
            placeholder="Max price"
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
            helperText="Max Price AMD"
          />
        </Box>
      </Collapse>

      <ColllapseItem
        prop="category"
        name="Category"
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
                  name={categoriesObj[category][key].category}
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
        name="Type"
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
                  name={name}
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

      <Box sx={{ display: 'flex', my: '15px', flexWrap: 'wrap' }}>
        <Typography sx={{ color: '#263045fb', fontWeight: 500, mb: '15px' }}> Size </Typography>
        <TextField
          key={`size${paramsState.size}`}
          type="number"
          placeholder="Size"
          defaultValue={paramsState.size}
          onFocus={(e) => (initialValue.current = e.target.value)}
          onBlur={(e) => {
            if (initialValue.current !== e.target.value) {
              handleChangeParams('size', e.target.value, noRout);
            }
          }}
          variant="outlined"
          onKeyDown={(e) => {
            if (['e', 'E', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          sx={{ ...textFieldStyle, width: '100%' }}
          // helperText="Size"
          size="small"
        />
      </Box>

      <Box sx={{ display: 'flex', my: '10px' }}>
        <IOSSwitch
          handleChangeParams={handleChangeParams}
          checked={paramsState.inStock === 'check'}
          noRout={noRout}
        />

        <Typography sx={{ color: '#263045fb', fontWeight: 500, ml: '15px' }}>Only in Stock</Typography>
      </Box>

      <ColllapseItem
        prop="brands"
        name="Brands"
        open={collapseItems.brands}
        handleCangeCollapse={handleCangeCollapse}
      />
      <Collapse sx={{ mb: '300px' }} in={collapseItems.brands} timeout="auto" unmountOnExit>
        <Autocomplete
          disablePortal
          blurOnSelect
          freeSolo
          // slots={{ popper: BottomPopper }}
          // slotProps={{
          //   paper: { sx: { maxHeight: 900 } },
          //   listbox: { sx: { maxHeight: 900 } },
          // }}
          sx={{ boxSizing: 'border-box', width: '100%', my: '10px' }}
          size="small"
          options={(categoriesObj?.[category]?.[paramsState.subCategory]?.brands || []).map(
            (option) => option
          )}
          renderInput={(params) => <TextField inputRef={inputRef} {...params} label="Brands" />}
          value={paramsState.brand || ''}
          onChange={(event, value, reason) => {
            if (reason !== 'clear') {
              handleChangeParams('brand', value ?? '', noRout);
            }
          }}
          onBlur={(e) => {
            if (!e.target.value && paramsState.brand) {
              handleChangeParams('brand', '', noRout);
            }
          }}
        />
      </Collapse>
    </Grid>
  );
}
