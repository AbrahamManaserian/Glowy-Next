'use client';

import { TextField } from '@mui/material';

const descriptionInputsArray = [
  { key: 'descriptionAm', name: 'Description Armenian' },
  { key: 'descriptionEn', name: 'Description English' },
  { key: 'descriptionRu', name: 'Description Russian' },
];

export default function DescriptionInput({ inputs, hadleChangeInputs }) {
  return (
    <>
      {descriptionInputsArray.map((item, index) => {
        return (
          <TextField
            multiline={true}
            minRows={4}
            key={`${index}-${item.key}-${inputs[item.key] ?? ''}`}
            defaultValue={inputs[item.key]}
            name={item.key}
            onBlur={(e) => hadleChangeInputs(e)}
            onChange={(e) => {
              if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                hadleChangeInputs(e);
              }
            }}
            sx={{
              boxSizing: 'border-box',
              width: {
                xs: item.type ? 'calc(50% - 5px)' : '100%',
                sm: '100%',
              },
              mr: { xs: 0, sm: '10px' },
              mt: '15px',
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none', // Chrome, Safari, Edge
                },
            }}
            size="small"
            label={item.name}
            variant="outlined"
          />
        );
      })}
    </>
  );
}
