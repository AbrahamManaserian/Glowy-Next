'use client';

import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useState } from 'react';
import { categoriesObj } from '@/app/admin/add-product/page';
import styled from '@emotion/styled';

const IOSSwitch = styled(({ noRout, checked, handleChangeParams, ...props }) => (
  <Switch
    onChange={(e) =>
      noRout
        ? handleChangeParams('inStock', e.target.checked ? 'check' : 'noCheck', true)
        : handleChangeParams('inStock', e.target.checked ? 'check' : 'noCheck')
    }
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
          onChange={() => (noRout ? handleChangeParams(prop, value, true) : handleChangeParams(prop, value))}
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

export default function Filter({ paramsState, handleChangeParams, noRout, category }) {
  const [collapseItems, setCollapseItems] = useState({
    type: true,
    category: true,
    price: true,
    brands: true,
  });

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
            key={`minPrice${paramsState.minPrice}`}
            type="number"
            placeholder="Min price"
            defaultValue={paramsState.minPrice}
            onBlur={(e) =>
              noRout
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
            onBlur={(e) =>
              noRout
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
        {paramsState.category && (
          <FormGroup sx={{ pl: '8px', mb: '5px' }}>
            {categoriesObj[category][paramsState.category].type.map((name, index) => {
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
      <Collapse in={collapseItems.brands} timeout="auto" unmountOnExit>
        <FormGroup
          sx={{
            pl: '8px',
            mb: '5px',
            maxHeight: '370px',
            overflow: 'scroll',
            flexWrap: 'nowrap',
            border: 'solid #dbdde1fb 0.5px',
            borderRadius: '10px',
            p: '10px',
            mt: '10px',
          }}
        >
          <Box
            onClick={() => handleChangeParams('brands', '', noRout)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              cursor: 'pointer',
              bgcolor: '#ede6e65e',
              borderRadius: '5px',
              py: '5px',
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: '20px', color: '#474141f6', mr: '5px' }} />
            <Typography>Reset</Typography>
          </Box>
          {((paramsState.subCategory && categoriesObj[category][paramsState.subCategory].brands) || []).map(
            (name, index) => {
              return (
                <FormItem
                  key={index}
                  handleChangeParams={handleChangeParams}
                  prop="brand"
                  name={name}
                  value={name}
                  noRout={noRout}
                  checked={paramsState.brand === name}
                />
              );
            }
          )}
        </FormGroup>
      </Collapse>
    </Grid>
  );
}
