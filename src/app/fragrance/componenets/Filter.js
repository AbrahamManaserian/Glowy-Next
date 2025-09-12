'use client';

import { Box, Checkbox, Collapse, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export default function Filter({ handleChangeParams, paramsState }) {
  const [openCollapse, setOpenCollapse] = useState(true);
  return (
    <Grid sx={{ borderRight: 1 }} container width={'300px'} direction={'column'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: '#263045fb', fontWeight: 500 }}>Gender</Typography>
        {openCollapse ? (
          <RemoveOutlinedIcon
            onClick={() => setOpenCollapse(false)}
            sx={{ color: '#263045fb', cursor: 'pointer' }}
          />
        ) : (
          <AddOutlinedIcon
            onClick={() => setOpenCollapse(true)}
            sx={{ color: '#263045fb', cursor: 'pointer' }}
          />
        )}
      </Box>
      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
        <FormGroup sx={{ mt: '10px' }}>
          <FormControlLabel
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                color: '#263045d9',
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
                checked={paramsState.gender.includes('all')}
                onChange={() => handleChangeParams('gender', 'all')}
              />
            }
            label="All"
          />
          <FormControlLabel
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                color: '#263045d9',
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
                checked={paramsState.gender.includes('women') || paramsState.gender.includes('all')}
                onChange={() => handleChangeParams('gender', 'women')}
              />
            }
            label="Women"
          />

          <FormControlLabel
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                color: '#263045d9',
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
                checked={paramsState.gender.includes('men') || paramsState.gender.includes('all')}
                onChange={() => handleChangeParams('gender', 'men')}
              />
            }
            label="Men"
          />
          <FormControlLabel
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                color: '#263045d9',
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
                checked={paramsState.gender.includes('uni') || paramsState.gender.includes('all')}
                onChange={() => handleChangeParams('gender', 'uni')}
              />
            }
            label="Uni"
          />
        </FormGroup>
      </Collapse>
    </Grid>
  );
}
