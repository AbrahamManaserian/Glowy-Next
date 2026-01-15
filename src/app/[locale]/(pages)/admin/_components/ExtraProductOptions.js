'use client';

import {
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import ImageInputs from './ImageInputs';
import { initialOptionInputs } from '../add-product/page';

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
  height,
  setLoading,
  createId,
  setCreateId,
  disableSwitch,
}) {
  const [open, setOpen] = useState(false);
  const [editState, setEditState] = useState(null);

  const addOption = () => {
    if (!options.optionKey || !options.optionValue || !options.optionPrice) {
      setRequiredOption(true);
      return;
    }
    const copyOptions = structuredClone(options);

    const { availableOptions, ...item } = copyOptions;

    availableOptions.push(item);
    // if (options.optionKey !== 'size' && !(options.optionKey in inputs.extraInputs)) {
    setInputs({
      ...inputs,
      extraInputs: {
        ...inputs.extraInputs,
        [options.optionKey]: availableOptionKeys[options.optionKey].name,
      },
    });
    // }
    setRequiredOption(false);
    setOptions({
      ...structuredClone(initialOptionInputs),
      optionKey: copyOptions.optionKey,
      availableOptions: [...availableOptions],
    });
  };

  const editOption = (index) => {
    if (!options.optionKey || !options.optionValue || !options.optionPrice) {
      setRequiredOption(true);
      return;
    }

    const copyOptions = structuredClone(options);
    const { availableOptions, ...item } = copyOptions;

    const updetedArr = availableOptions.map((it, i) => (i === editState ? item : it));
    setRequiredOption(false);
    setOptions({
      ...structuredClone(initialOptionInputs),
      optionKey: copyOptions.optionKey,
      availableOptions: updetedArr,
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

    if (options.availableOptions[index].optionKey in inputs.extraInputs && checkKey <= 1) {
      const updatedInputs = { ...inputs };
      delete updatedInputs.extraInputs[options.availableOptions[index].optionKey];
      if (options.availableOptions[index].optionKey !== 'size') {
        delete updatedInputs[options.availableOptions[index].optionKey];
      }

      setInputs(updatedInputs);
    }
    setOptions({ ...options, availableOptions: filteredOptions });
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#bdd5f446',
        padding: '15px',
        marginBottom: '15px',
        boxSizing: 'border-box',
      }}
    >
      <Button
        sx={{ textTransform: 'capitalize' }}
        color="secondary"
        endIcon={open ? <RemoveIcon /> : <AddIcon />}
        onClick={() => setOpen(!open)}
      >
        More options
      </Button>
      <FormControlLabel
        sx={{ width: '100%', my: '10px' }}
        control={
          <Switch
            disabled={disableSwitch}
            color="warning"
            checked={createId}
            onChange={(e) => setCreateId(e.target.checked)}
            name="gilad"
          />
        }
        label="Create options with unique IDs"
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 5px 10px 5px' }}>
          <Typography sx={{ width: '100%', mb: '10px' }}>Created Available Options</Typography>
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
        <div style={{ marginBottom: '5px' }}>
          <Button
            onClick={editState || editState === 0 ? editOption : addOption}
            variant="contained"
            color="success"
            sx={{
              textTransform: 'capitalize',
              width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
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
                    ...structuredClone(initialOptionInputs),
                    optionKey: options.optionKey,
                    availableOptions: options.availableOptions,
                  });
                }}
                sx={{
                  textTransform: 'capitalize',
                  width: { xs: 'calc(50% - 5px)', sm: 'calc(20% - 10px)' },
                  mr: { xs: 0, sm: '10px' },
                  // mb: '15px',
                  ml: { xs: '5px', sm: 0 },
                  mb: '10px',
                }}
              >
                Cancel
              </Button>
            )}
          </>
        </div>
        <FormControl
          disabled={options.availableOptions.length > 0 || options.disableOption ? true : false}
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
          // type={options.optionKey === 'size' || options.optionKey === 'number' ? 'number' : ''}
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
          key={`optionDisacountedPrice${options.optionPreviousPrice}`}
          defaultValue={options.optionPreviousPrice}
          type="number"
          name="optionPreviousPrice"
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
          label="Previous Price"
          variant="outlined"
          helperText={' '}
        />
        <ImageInputs
          requiredFields={requiredOption}
          inputs={options}
          setInputs={setOptions}
          height={height}
          setLoading={setLoading}
        />
      </Collapse>
    </div>
  );
}
