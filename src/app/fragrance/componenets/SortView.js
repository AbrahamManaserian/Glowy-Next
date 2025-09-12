import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { GridViewIcon, ListViewIcon } from '@/components/icons';

export default function SortView({ handleChangeParams, paramsState }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <div
        onClick={() => handleChangeParams('view', 'list')}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: paramsState.view === 'list' ? '#807d7d48' : '',
          borderRadius: '5px',
          marginRight: '10px',
          cursor: 'pointer',
        }}
      >
        <ListViewIcon />
      </div>
      <div
        onClick={() => handleChangeParams('view', 'grid')}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: paramsState.view === 'grid' ? '#807d7d48' : '',
          borderRadius: '5px',
          cursor: 'pointer',
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
          onChange={(event) => handleChangeParams('sortBy', event.target.value)}
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
