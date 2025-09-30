'use client';

import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import { GridViewIcon, ListViewIcon } from '@/components/icons';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortView({ toggleDrawer }) {
  const [paramsState, setParamsState] = useState({
    sortBy: '',
    view: '',
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const makeRout = (prop, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(prop, value);
    router.push(`?${params.toString()}`);
  };

  const handleChangeParams = (prop, value, rout) => {
    setParamsState({ ...paramsState, [prop]: value });
    if (rout) {
      makeRout(prop, value);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: { xs: '100%', sm: '100%', md: 'auto' },
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      {/* <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' }, flexGrow: 1 }}>
        <Box onClick={() => toggleDrawer(true)} sx={{ display: 'flex' }}>
          <TuneIcon sx={{ color: '#8a8c8dff' }} />
          <Typography
            // onClick={() => toggleDrawer(true)}
            sx={{ color: '#262b2eff', fontSize: '14px', ml: '10px' }}
          >
            Filters
          </Typography>
        </Box>
      </Box> */}

      <div
        onClick={() => handleChangeParams('view', 'list', true)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: paramsState.view === 'list' ? '#807d7d48' : '',
          borderRadius: '5px',
          marginRight: '10px',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <ListViewIcon />
      </div>
      <div
        onClick={() => handleChangeParams('view', 'grid', true)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: paramsState.view === 'grid' ? '#807d7d48' : '',
          borderRadius: '5px',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <GridViewIcon />
      </div>

      <FormControl
        sx={{
          width: { xs: '100px', sm: '150px' },
          ml: '10px',
        }}
      >
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            color: '#55585aff',
            fontSize: '14px',
            top: '-10px',
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
          value={paramsState.sortBy}
          onChange={(event) => handleChangeParams('sortBy', event.target.value, true)}
          IconComponent={ExpandMoreIcon}
          sx={{
            position: 'relative',
            height: '30px',
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
    </Box>
  );
}
