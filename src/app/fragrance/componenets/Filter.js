'use client';

import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputBase,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export default function Filter({ handleChangeParams, paramsState, handleChangeCategoryParams, makeRout }) {
  const [openCollapseGender, setOpenCollapseGender] = useState(true);
  const [openCollapseCategory, setOpenCollapseCategory] = useState(true);
  const [openCollapsePrice, setOpenCollapsePrice] = useState(true);

  return (
    <Grid container sx={{ width: '250px' }} direction={'column'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '10px' }}>
        <Typography sx={{ color: '#263045fb', fontWeight: 500 }}>Price</Typography>
        {openCollapsePrice ? (
          <RemoveOutlinedIcon
            onClick={() => setOpenCollapsePrice(false)}
            sx={{ color: '#263045fb', cursor: 'pointer' }}
          />
        ) : (
          <AddOutlinedIcon
            onClick={() => setOpenCollapsePrice(true)}
            sx={{ color: '#263045fb', cursor: 'pointer' }}
          />
        )}
      </Box>

      <Collapse in={openCollapsePrice} timeout="auto" unmountOnExit>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '10px' }}>
          <TextField
            type="number"
            placeholder="Min price"
            variant="outlined"
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            sx={{
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
                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                  {
                    WebkitAppearance: 'none', // Chrome, Safari, Edge
                    margin: 0,
                  },
              },
              '& .MuiOutlinedInput-input': {
                padding: 0, // remove default padding
              },
            }}
            helperText="Min Price AMD"
          />
          <TextField
            type="number"
            placeholder="Min price"
            variant="outlined"
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            sx={{
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
                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                  {
                    WebkitAppearance: 'none', // Chrome, Safari, Edge
                    margin: 0,
                  },
              },
              '& .MuiOutlinedInput-input': {
                padding: 0, // remove default padding
              },
            }}
            helperText="Max Price AMD"
          />
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '10px' }}>
        <Typography sx={{ color: '#263045fb', fontWeight: 500 }}>Category</Typography>
        {openCollapseCategory ? (
          <RemoveOutlinedIcon
            onClick={() => setOpenCollapseCategory(false)}
            sx={{ color: '#263045fb', cursor: 'pointer' }}
          />
        ) : (
          <AddOutlinedIcon
            onClick={() => setOpenCollapseCategory(true)}
            sx={{ color: '#263045fb', cursor: 'pointer' }}
          />
        )}
      </Box>

      <Collapse in={openCollapseCategory} timeout="auto" unmountOnExit>
        <FormGroup sx={{ pl: '8px', mb: '5px' }}>
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
                checked={paramsState.category.includes('fragrance')}
                onChange={() =>
                  makeRout
                    ? handleChangeCategoryParams('fragrance')
                    : handleChangeCategoryParams('fragrance', true)
                }
              />
            }
            label="Fragrance"
          />
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
                checked={paramsState.category.includes('car-air-fresheners')}
                onChange={() =>
                  makeRout
                    ? handleChangeCategoryParams('car-air-fresheners')
                    : handleChangeCategoryParams('car-air-fresheners', true)
                }
              />
            }
            label="Car Air Fresheners"
          />

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
                checked={paramsState.category.includes('home-air-fresheners')}
                onChange={() =>
                  makeRout
                    ? handleChangeCategoryParams('home-air-fresheners')
                    : handleChangeCategoryParams('home-air-fresheners', true)
                }
              />
            }
            label="Home Air Fresheners"
          />
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
                checked={paramsState.category.includes('deodorant')}
                onChange={() =>
                  makeRout
                    ? handleChangeCategoryParams('deodorant')
                    : handleChangeCategoryParams('deodorant', true)
                }
              />
            }
            label="Deodorant"
          />
        </FormGroup>
      </Collapse>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '10px' }}>
        <Typography sx={{ color: '#263045fb', fontWeight: 500 }}>Gender</Typography>
        {openCollapseGender ? (
          <RemoveOutlinedIcon
            onClick={() => setOpenCollapseGender(false)}
            sx={{ color: '#263045fb', cursor: 'pointer' }}
          />
        ) : (
          <AddOutlinedIcon
            onClick={() => setOpenCollapseGender(true)}
            sx={{ color: '#263045fb', cursor: 'pointer' }}
          />
        )}
      </Box>

      <Collapse in={openCollapseGender} timeout="auto" unmountOnExit>
        <FormGroup sx={{ pl: '8px', mb: '5px' }}>
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
                checked={paramsState.gender.includes('women')}
                onChange={() =>
                  makeRout
                    ? handleChangeParams('gender', 'women')
                    : handleChangeParams('gender', 'women', true)
                }
              />
            }
            label="Women"
          />

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
                checked={paramsState.gender.includes('men')}
                onChange={() =>
                  makeRout ? handleChangeParams('gender', 'men') : handleChangeParams('gender', 'men', true)
                }
              />
            }
            label="Men"
          />
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
                checked={paramsState.gender.includes('uni')}
                onChange={() =>
                  makeRout ? handleChangeParams('gender', 'uni') : handleChangeParams('gender', 'uni', true)
                }
              />
            }
            label="Uni"
          />
        </FormGroup>
      </Collapse>
    </Grid>
  );
}
