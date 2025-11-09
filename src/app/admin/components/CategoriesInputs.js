'use client';

import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

export default function CategoriesInputs({ inputs, requiredFields, hadleChangeInputs, categoriesObj }) {
  return (
    <>
      <FormControl
        error={!inputs.category && requiredFields}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
          // mb: '15px',
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
        <FormHelperText sx={{ visibility: !inputs.category && requiredFields ? 'unset' : 'hidden' }}>
          Required
        </FormHelperText>
      </FormControl>

      <FormControl
        error={!inputs.subCategory && requiredFields}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
          // mb: '15px',
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
        <FormHelperText sx={{ visibility: !inputs.subCategory && requiredFields ? 'unset' : 'hidden' }}>
          Required
        </FormHelperText>
      </FormControl>

      <FormControl
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
          mb: '20px',
        }}
        size="small"
      >
        <InputLabel>Type</InputLabel>
        <Select
          disabled={
            !inputs.subCategory || !categoriesObj[inputs.category][inputs.subCategory]?.type[0] ? true : false
          }
          value={inputs.type}
          name="type"
          label="Type"
          onChange={hadleChangeInputs}
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
      </FormControl>
    </>
  );
}
