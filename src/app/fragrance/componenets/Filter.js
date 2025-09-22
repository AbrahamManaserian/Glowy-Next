'use client';

import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const categoryObj = {
  fragrance: 'Fragrance',
  'car-air-fresheners': 'Car-Air-Fresheners',
  'home-air-fresheners': 'Home Air Fresheners',
  deodorant: 'Deodorant',
};

const genderBoj = { women: 'Women', men: 'Men', uni: 'Uni' };

const textFieldStyle = {
  width: '120px',
  '& .MuiOutlinedInput-root': {
    height: '40px',
    fontSize: '14px',
    backgroundColor: '#d2cccc4d',
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

const FormItem = ({ array, prop, value, name, makeRout, handleChangeArrayParams }) => {
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
          checked={array.includes(value)}
          onChange={() =>
            makeRout ? handleChangeArrayParams(prop, value, true) : handleChangeArrayParams(prop, value)
          }
        />
      }
      label={name}
    />
  );
};

export default function Filter({ paramsState, handleChangeParams, makeRout, handleChangeArrayParams }) {
  const [collapseItems, setCollapseItems] = useState({
    gender: true,
    category: true,
    price: true,
  });
  //   console.log(makeRout);
  const handleCangeCollapse = (key, value) => {
    setCollapseItems({ ...collapseItems, [key]: value });
  };

  return (
    <Grid container sx={{ width: '250px' }} direction={'column'}>
      <ColllapseItem
        prop="price"
        name="Price"
        open={collapseItems.price}
        handleCangeCollapse={handleCangeCollapse}
      />
      <Collapse in={collapseItems.price} timeout="auto" unmountOnExit>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '10px' }}>
          <TextField
            type="number"
            placeholder="Min price"
            defaultValue={paramsState.minPrice}
            onBlur={(e) =>
              makeRout
                ? handleChangeParams('minPrice', e.target.value, true)
                : handleChangeParams('minPrice', e.target.value)
            }
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
            type="number"
            placeholder="Max price"
            variant="outlined"
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            defaultValue={paramsState.maxPrice}
            onBlur={(e) =>
              makeRout
                ? handleChangeParams('maxPrice', e.target.value, true)
                : handleChangeParams('maxPrice', e.target.value)
            }
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
          {Object.keys(categoryObj).map((name, index) => {
            return (
              <FormItem
                key={index}
                handleChangeArrayParams={handleChangeArrayParams}
                array={paramsState.category}
                prop="category"
                name={categoryObj[name]}
                value={name}
                makeRout={makeRout}
              />
            );
          })}
        </FormGroup>
      </Collapse>
      <ColllapseItem
        prop="gender"
        name="Gender"
        open={collapseItems.gender}
        handleCangeCollapse={handleCangeCollapse}
      />
      <Collapse in={collapseItems.gender} timeout="auto" unmountOnExit>
        <FormGroup sx={{ pl: '8px', mb: '5px' }}>
          {Object.keys(genderBoj).map((name, index) => {
            return (
              <FormItem
                key={index}
                handleChangeArrayParams={handleChangeArrayParams}
                array={paramsState.gender}
                prop="gender"
                name={genderBoj[name]}
                value={name}
                makeRout={makeRout}
              />
            );
          })}
        </FormGroup>
      </Collapse>
    </Grid>
  );
}
