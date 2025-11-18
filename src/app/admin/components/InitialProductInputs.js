'use client';

import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const unitOptions = [
  { label: 'Milliliters (ml)', value: 'ml' },
  { label: 'Liters (L)', value: 'L' },
  { label: 'Grams (g)', value: 'g' },
  { label: 'Kilograms (kg)', value: 'kg' },
];

const inputsArray = [
  { key: 'brand', name: 'Brand' },
  { key: 'model', name: 'Model' },
  { key: 'name', name: 'Name' },
  { key: 'size', name: 'Size', type: 'number', marginRight: '5px' },
  { key: 'unit', name: 'Unit', type: 'number', marginLeft: '5px' },
  { key: 'coast', name: 'Coast', type: 'number', marginRight: '5px' },
  { key: 'price', name: 'Price', type: 'number', marginLeft: '5px' },
  { key: 'previousPrice', name: 'Previous Price', type: 'number', marginRight: '5px' },
  { key: 'qouantity', name: 'Qouantity', type: 'number', marginLeft: '5px' },
  { key: 'supplier', name: 'Supplier' },
];

export default function InitialProductInputs({
  inputs,
  hadleChangeInputs,
  suppliers,
  brands,
  requiredFields,
}) {
  return (
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
                {Object.keys(suppliers).map((key, index) => {
                  return (
                    <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={suppliers[key].name}>
                      {suppliers[key].name || 'No name'}
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
                // mb: '15px',
              }}
              size="small"
              freeSolo
              options={(brands || []).map((option) => option)}
              renderInput={(params) => (
                <TextField
                  helperText={!inputs.brand && requiredFields ? 'Required' : ' '}
                  error={!inputs.brand && requiredFields}
                  name={item.key}
                  {...params}
                  label="Brand"
                />
              )}
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
              helperText={!inputs.model && item.key === 'model' && requiredFields ? 'Required' : null}
              error={!inputs.model && requiredFields && item.key === 'model'}
              type={item.type === 'number' ? 'number' : ''}
              key={`${index}-${item.key}-${inputs[item.key] ?? ''}`}
              defaultValue={inputs[item.key]}
              name={item.key}
              onBlur={(e) => hadleChangeInputs(e)}
              onChange={(e) => {
                if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                  hadleChangeInputs(e);
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
              size="small"
              label={`${item.name}${item.key === 'name' ? ' *' : ''}`}
              variant="outlined"
            />
          );
        }
      })}
    </>
  );
}
