'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { Typography } from '@mui/material';

export default function CategoryList({ name, data }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        bgcolor: 'background.paper',
        flexWrap: 'wrap',
        alignItems: 'stretch',
      }}
    >
      {Object.keys(data).map((category, index) => {
        return (
          <List key={index} sx={{ minWidth: '150px' }}>
            <Typography sx={{ fontSize: '12px', ml: '7px', fontWeight: 500 }}>{category}</Typography>
            {data[category].map((item, index) => {
              return (
                <ListItemButton key={index} sx={{ height: '35px' }}>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 400,
                      letterSpacing: 0,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        );
      })}
    </Box>
  );
}
