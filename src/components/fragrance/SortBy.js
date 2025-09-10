'use client';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useState } from 'react';

export default function SortBy() {
  const [sortBy, setSortBy] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const handleChangeSortBy = (event) => {
    setSortBy(event.target.value);

    params.set('sortby', event.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl
      sx={{
        width: '150px',
      }}
    >
      <InputLabel
        id="demo-simple-select-label"
        sx={{
          color: '#55585aff',
          fontSize: '14px',
          top: '-5px',
          // Only adjust the unshrunk position
          '&.MuiInputLabel-shrink': {
            top: 0,
          },
          '&.Mui-focused': {
            color: '#181e22ff',
            top: 0,
          },
        }}
      >
        Sort by
      </InputLabel>

      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Sort by"
        value={sortBy}
        onChange={handleChangeSortBy}
        IconComponent={ExpandMoreIcon}
        sx={{
          position: 'relative',
          height: '40px',
          fontSize: '14px',
          color: '#55585aff',
          display: 'flex',
          alignItems: 'center',
          '.MuiSvgIcon-root': { color: '#55585aff' },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: '#55585aff',
            border: 0.5,
            borderRadius: '10px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#55585aff',
            border: 1,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#55585aff',
            border: 1.5,
          },
        }}
        inputProps={{ sx: { height: '40px', display: 'flex', alignItems: 'center' } }}
      >
        <MenuItem value={'latest'}>Latest</MenuItem>
        <MenuItem value={'oldest'}>Oldest</MenuItem>
        <MenuItem value={'popular'}>Popular</MenuItem>
      </Select>
    </FormControl>
  );
}
