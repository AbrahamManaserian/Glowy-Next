'use client';

import {
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';

const availableOptionKeys = {
  color: { name: 'Color' },
  size: { name: 'Size' },
  number: { name: 'Number' },
  other: { name: 'Other' },
};

export default function ExtraProductOptions({
  inputs,
  requiredOption,
  setRequiredOption,
  options,
  setOptions,
  setInputs,
  handleChangeOptions,
}) {
  const [open, setOpen] = useState(false);
  const [editState, setEditState] = useState(null);

  const addOption = () => {
    if (!options.optionKey || !options.optionValue || !options.optionPrice) {
      setRequiredOption(true);
      return;
    }
    const item = {
      optionKey: options.optionKey,
      optionValue: options.optionValue,
      optionPrice: options.optionPrice,
      optionCoast: options.optionCoast,
      optionQouantity: options.optionQouantity,
      optionDisacountedPrice: options.optionDisacountedPrice,
    };
    const availableOptions = options.availableOptions;

    availableOptions.push(item);
    if (options.optionKey !== 'size' && !(options.optionKey in inputs.extraInputs)) {
      setInputs({
        ...inputs,
        extraInputs: {
          ...inputs.extraInputs,
          [options.optionKey]: availableOptionKeys[options.optionKey].name,
        },
      });
    }
    setRequiredOption(false);
    setOptions({
      availableOptions: availableOptions,
      optionKey: '',
      optionValue: '',
      optionPrice: '',
      optionDisacountedPrice: '',
      optionCoast: '',
      optionQouantity: '',
    });
  };

  const editOption = (index) => {
    if (!options.optionKey || !options.optionValue || !options.optionPrice) {
      setRequiredOption(true);
      return;
    }
    const item = {
      optionKey: options.optionKey,
      optionValue: options.optionValue,
      optionPrice: options.optionPrice,
      optionCoast: options.optionCoast,
      optionQouantity: options.optionQouantity,
      optionDisacountedPrice: options.optionDisacountedPrice,
    };
    const updetedArr = options.availableOptions.map((it, i) => (i === editState ? item : it));
    setRequiredOption(false);
    setOptions({
      availableOptions: updetedArr,
      optionKey: '',
      optionValue: '',
      optionPrice: '',
      optionDisacountedPrice: '',
      optionCoast: '',
      optionQouantity: '',
    });
    setEditState(null);
  };

  const deleteOption = (index) => {
    let checkKey = 0;
    const filteredOptions = options.availableOptions.filter((item, i) => {
      if (item.optionKey === options.availableOptions[index].optionKey) {
        checkKey = checkKey + 1;
      }
      return i !== index;
    });

    if (
      options.availableOptions[index].optionKey in inputs.extraInputs &&
      checkKey <= 1 &&
      options.availableOptions[index].optionKey !== 'size'
    ) {
      const updatedInputs = inputs;
      delete updatedInputs.extraInputs[options.availableOptions[index].optionKey];
      delete updatedInputs[options.availableOptions[index].optionKey];

      setInputs(updatedInputs);
    }
    setOptions({ ...options, availableOptions: filteredOptions });
  };

  return (
    <>
      <div style={{ width: '100%' }}>
        <Button
          sx={{ textTransform: 'capitalize', mb: '10px' }}
          color="secondary"
          endIcon={open ? <RemoveIcon /> : <AddIcon />}
          onClick={() => setOpen(!open)}
        >
          More options
        </Button>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <FormControl
            sx={{
              boxSizing: 'border-box',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: '5px', sm: '10px' },
              // mb: '15px',
            }}
            size="small"
            error={!options.optionKey && requiredOption ? true : false}
          >
            <InputLabel>Option key</InputLabel>
            <Select
              name="optionKey"
              value={options.optionKey}
              label="Option key"
              onChange={handleChangeOptions}
            >
              {Object.keys(availableOptionKeys).map((key, index) => {
                return (
                  <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={key}>
                    {availableOptionKeys[key].name}
                  </MenuItem>
                );
              })}
            </Select>

            <FormHelperText> {!options.optionKey && requiredOption ? 'Required' : ' '}</FormHelperText>
          </FormControl>

          <TextField
            key={`optionValue ${options.optionValue}`}
            defaultValue={options.optionValue}
            name="optionValue"
            onBlur={(e) => handleChangeOptions(e)}
            onChange={(e) => {
              if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                handleChangeOptions(e);
              }
            }}
            sx={{
              boxSizing: 'border-box',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: 0, sm: '10px' },
              // mb: '15px',
              ml: { xs: '5px', sm: 0 },
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none', // Chrome, Safari, Edge
                },
            }}
            size="small"
            label="Option value"
            variant="outlined"
            error={!options.optionValue && requiredOption ? true : false}
            helperText={!options.optionValue && requiredOption ? 'Required' : ' '}
          />
          <TextField
            key={`optionCoast${options.optionCoast}`}
            defaultValue={options.optionCoast}
            type="number"
            name="optionCoast"
            onBlur={(e) => handleChangeOptions(e)}
            onChange={(e) => {
              if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                handleChangeOptions(e);
              }
            }}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            sx={{
              boxSizing: 'border-box',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: '5px', sm: '10px' },

              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none', // Chrome, Safari, Edge
                },
            }}
            size="small"
            label="Coast"
            variant="outlined"
            helperText={' '}
          />

          <TextField
            key={`optionQouantity${options.optionQouantity}`}
            defaultValue={options.optionQouantity}
            type="number"
            name="optionQouantity"
            onBlur={(e) => handleChangeOptions(e)}
            onChange={(e) => {
              if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                handleChangeOptions(e);
              }
            }}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            sx={{
              boxSizing: 'border-box',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: 0, sm: '10px' },
              ml: { xs: '5px', sm: 0 },

              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none', // Chrome, Safari, Edge
                },
            }}
            size="small"
            label="Qouantity"
            variant="outlined"
            helperText={' '}
          />
          <TextField
            key={`optionPrice${options.optionPrice}`}
            defaultValue={options.optionPrice}
            type="number"
            name="optionPrice"
            onBlur={(e) => handleChangeOptions(e)}
            onChange={(e) => {
              if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                handleChangeOptions(e);
              }
            }}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            sx={{
              boxSizing: 'border-box',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: 0, sm: '10px' },
              // mb: '15px',
              // ml: { xs: '5px', sm: 0 },

              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none', // Chrome, Safari, Edge
                },
            }}
            size="small"
            label="Price"
            variant="outlined"
            error={!options.optionPrice && requiredOption ? true : false}
            helperText={!options.optionPrice && requiredOption ? 'Required' : ' '}
          />
          <TextField
            key={`optionDisacountedPrice${options.optionDisacountedPrice}`}
            defaultValue={options.optionDisacountedPrice}
            type="number"
            name="optionDisacountedPrice"
            onBlur={(e) => handleChangeOptions(e)}
            onChange={(e) => {
              if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                handleChangeOptions(e);
              }
            }}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            sx={{
              boxSizing: 'border-box',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
              mr: { xs: 0, sm: '10px' },
              // mb: '15px',
              ml: { xs: '10px', sm: 0 },

              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none', // Chrome, Safari, Edge
                },
            }}
            size="small"
            label="Disacounted Price"
            variant="outlined"
            helperText={' '}
          />
          <Button
            onClick={editState || editState === 0 ? editOption : addOption}
            variant="contained"
            color="success"
            sx={{
              textTransform: 'capitalize',
              width: { xs: 'calc(50% - 10px)', sm: 'calc(20% - 10px)' },
              mr: { xs: '5px', sm: '10px' },
              mb: '10px',
            }}
          >
            {editState || editState === 0 ? 'Edit option' : 'Add option'}
          </Button>
          <>
            {(editState || editState === 0) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditState(null);
                  setOptions({
                    ...options,
                    optionKey: '',
                    optionValue: '',
                    optionPrice: '',
                    optionDisacountedPrice: '',
                    optionCoast: '',
                    optionQouantity: '',
                  });
                }}
                sx={{
                  textTransform: 'capitalize',
                  width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
                  mr: { xs: 0, sm: '10px' },
                  // mb: '15px',
                  // ml: { xs: '5px', sm: 0 },
                  mb: '10px',
                }}
              >
                Cancel
              </Button>
            )}
          </>
          <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 5px 10px 5px' }}>
            <Typography sx={{ width: '100%', mb: '10px' }}>Added Available Options</Typography>
            {options.availableOptions.map((item, index) => {
              if ((editState || editState === 0) && editState === index) {
                return (
                  <div
                    style={{
                      border: 'solid 0.5px',
                      padding: ' 30px 20px',
                      margin: '0 15px 15px 0',
                      position: 'relative',
                      borderRadius: '5px',
                      overflow: 'hidden',
                    }}
                    key={index}
                  >
                    <EditIcon
                      onClick={() => {
                        setEditState(index);
                        setOptions({ ...options, ...item });
                      }}
                      sx={{ position: 'absolute', top: 0, left: 0, color: 'white', bgcolor: '#03a9f4' }}
                    />
                    <ClearIcon
                      onClick={() => deleteOption(index)}
                      sx={{ position: 'absolute', top: 0, right: 0, color: 'white', bgcolor: 'red' }}
                    />
                    <Typography>
                      {availableOptionKeys[item.optionKey].name} - {item.optionValue}
                    </Typography>
                    <Typography>Price - {item.optionPrice}</Typography>
                  </div>
                );
              } else if (!editState && editState !== 0) {
                return (
                  <div
                    style={{
                      border: 'solid 0.5px',
                      padding: '30px 20px',
                      margin: '0 15px 15px 0',
                      position: 'relative',
                      borderRadius: '5px',
                      overflow: 'hidden',
                    }}
                    key={index}
                  >
                    <EditIcon
                      onClick={() => {
                        setEditState(index);
                        setOptions({ ...options, ...item });
                      }}
                      sx={{ position: 'absolute', top: 0, left: 0, color: 'white', bgcolor: '#03a9f4' }}
                    />
                    <ClearIcon
                      onClick={() => deleteOption(index)}
                      sx={{ position: 'absolute', top: 0, right: 0, color: 'white', bgcolor: 'red' }}
                    />
                    <Typography>
                      {availableOptionKeys[item.optionKey].name} - {item.optionValue}
                    </Typography>
                    <Typography>Price - {item.optionPrice}</Typography>
                  </div>
                );
              }
            })}
          </div>
        </Collapse>
      </div>
    </>
  );
}
