'use client';

import styled from '@emotion/styled';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import NextImage from 'next/image';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function AddEditProductInputs({
  inputs,
  requiredFields,
  hadleChangeInputs,
  setInputs,
  handleChangeCategory,
  categoriesObj,
  handleChangeSubCategory,
  handleChangeSelect,
  data,
  handleUploadImage,
  imagePreviews,
  height,
  mainImage,
  handleDeleteImage,
  handleClick,
  buttonText,
}) {
  return (
    <Grid
      sx={{
        maxWidth: '1150px',
        margin: '0 auto',
        flexWrap: 'wrap',
        overflow: 'hidden',
        mt: '40px',
        boxSizing: 'border-box',
        py: '10px',
      }}
      container
      size={12}
    >
      <TextField
        key={`0${inputs.name}`}
        error={!!requiredFields && !inputs.name}
        defaultValue={inputs.name}
        name="name"
        onBlur={(e) => hadleChangeInputs(e)}
        onChange={(e) => {
          if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
          }
        }}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
        }}
        helperText={requiredFields && !inputs.name ? 'Required' : ' '}
        size="small"
        label="Name"
        variant="outlined"
      />
      <FormControl
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
        }}
        size="small"
        error={!!requiredFields && !inputs.category}
      >
        <InputLabel>Category</InputLabel>
        <Select value={inputs.category} label="Category" onChange={handleChangeCategory}>
          {Object.keys(categoriesObj).map((key, index) => {
            return (
              <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={key}>
                {key}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{requiredFields && !inputs.category ? 'Required' : ' '}</FormHelperText>
      </FormControl>
      <FormControl
        // error={!!requiredFields && !inputs.subCategory}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25% - 10px)' },
          mr: { xs: 0, sm: '10px' },
        }}
        size="small"
      >
        <InputLabel>Sub category</InputLabel>
        <Select
          disabled={inputs.category ? false : true}
          value={inputs.subCategory}
          label="Sub category"
          onChange={handleChangeSubCategory}
        >
          {inputs.category &&
            Object.keys(categoriesObj[inputs.category]).map((key, index) => {
              if (key !== 'routTo') {
                return (
                  <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={key}>
                    {key}
                  </MenuItem>
                );
              }
            })}
        </Select>
        <FormHelperText> </FormHelperText>
      </FormControl>
      <FormControl
        // error={!!requiredFields && !inputs.type}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(25%)' },
          // mb: '15px',
        }}
        size="small"
      >
        <InputLabel>Type</InputLabel>
        <Select
          name="type"
          disabled={inputs.subCategory ? false : true}
          value={inputs.type}
          label="Type"
          onChange={handleChangeSelect}
        >
          {inputs.subCategory &&
            Object.keys(categoriesObj[inputs.category][inputs.subCategory]).map((key, index) => {
              if (key !== 'routTo') {
                return (
                  <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={key}>
                    {key}
                  </MenuItem>
                );
              }
            })}
        </Select>
        <FormHelperText> </FormHelperText>
      </FormControl>
      <TextField
        error={!!requiredFields && !inputs.cost}
        helperText={requiredFields && !inputs.cost ? 'Required' : ' '}
        defaultValue={inputs.cost}
        type="number"
        name="cost"
        onKeyDown={(e) => {
          if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        onBlur={(e) => hadleChangeInputs(e)}
        key={`1${inputs.cost}`}
        onChange={(e) => {
          if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
          }
        }}
        sx={{
          boxSizing: 'border-box',

          width: { xs: '100%', sm: 'calc(20% - 10px)' },
          mr: { xs: 0, sm: '10px' },
          // mb: '15px',
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none', // Chrome, Safari, Edge
            },
        }}
        size="small"
        label="Cost"
        variant="outlined"
      />
      <TextField
        error={!!requiredFields && !inputs.price}
        helperText={requiredFields && !inputs.price ? 'Required' : ' '}
        defaultValue={inputs.price}
        type="number"
        name="price"
        onKeyDown={(e) => {
          if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        onBlur={(e) => hadleChangeInputs(e)}
        key={`2${inputs.price}`}
        onChange={(e) => {
          if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
          }
        }}
        sx={{
          boxSizing: 'border-box',

          width: { xs: '100%', sm: 'calc(20% - 10px)' },
          mr: { xs: 0, sm: '10px' },
          // mb: '15px',
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none', // Chrome, Safari, Edge
            },
        }}
        size="small"
        label="Price"
        variant="outlined"
      />
      <TextField
        helperText={' '}
        defaultValue={inputs.disacuntedPrice}
        type="number"
        name="disacuntedPrice"
        onKeyDown={(e) => {
          if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        onBlur={(e) => hadleChangeInputs(e)}
        key={`3${inputs.disacuntedPrice}`}
        onChange={(e) => {
          if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
          }
        }}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(20% - 10px)' },
          mr: { xs: 0, sm: '10px' },

          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none', // Chrome, Safari, Edge
            },
        }}
        size="small"
        label="Disacunted Price"
        variant="outlined"
      />
      <TextField
        helperText={' '}
        defaultValue={inputs.quantity}
        type="number"
        name="quantity"
        onKeyDown={(e) => {
          if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        onBlur={(e) => hadleChangeInputs(e)}
        key={`4${inputs.quantity}`}
        onChange={(e) => {
          if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
          }
        }}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(20% - 10px)' },
          mr: { xs: 0, sm: '10px' },
          // mb: '15px',
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none', // Chrome, Safari, Edge
            },
        }}
        size="small"
        label="Quantity"
        variant="outlined"
      />

      <FormControl
        sx={{
          boxSizing: 'border-box',
          width: { xs: '100%', sm: 'calc(20%)' },
          //   mb: '15px',
        }}
        size="small"

        // color="success"
      >
        <InputLabel>Select Suplier</InputLabel>
        <Select name="supplier" value={inputs.supplier} label="Select Suplier" onChange={handleChangeSelect}>
          {Object.keys(data.suppliers).map((key, index) => {
            return (
              <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={data.suppliers[key].name}>
                {data.suppliers[key].name || 'No name'}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{requiredFields && !inputs.supplier ? 'Required' : ' '}</FormHelperText>
      </FormControl>

      <TextField
        multiline={true}
        minRows={4}
        name="description"
        defaultValue={inputs.description}
        onBlur={(e) => hadleChangeInputs(e)}
        key={`5${inputs.name}`}
        onChange={(e) => {
          if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
          }
        }}
        sx={{
          boxSizing: 'border-box',
          width: '100%',
          mb: '15px',
        }}
        size="small"
        label="Description Armenian"
        variant="outlined"
      />
      <TextField
        multiline={true}
        minRows={4}
        name="descriptionEn"
        defaultValue={inputs.descriptionEn}
        onBlur={(e) => hadleChangeInputs(e)}
        key={`6${inputs.name}`}
        onChange={(e) => {
          if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
          }
        }}
        sx={{
          boxSizing: 'border-box',
          width: '100%',
          mb: '15px',
        }}
        size="small"
        label="Description English"
        variant="outlined"
      />
      <TextField
        multiline={true}
        minRows={4}
        name="descriptionRu"
        defaultValue={inputs.descriptionRu}
        onBlur={(e) => hadleChangeInputs(e)}
        key={`7${inputs.name}`}
        onChange={(e) => {
          if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
          }
        }}
        sx={{
          boxSizing: 'border-box',
          width: '100%',
          mb: '15px',
        }}
        size="small"
        label="Description Russian"
        variant="outlined"
      />

      <div style={{ width: '100%' }}>
        <Button
          sx={{ textTransform: 'capitalize' }}
          component="label"
          role={undefined}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload main image
          <VisuallyHiddenInput
            name="mainImage"
            accept="image/*"
            type="file"
            onChange={(e) => hadleChangeInputs(e)}
          />
        </Button>
      </div>
      <Typography
        color="error"
        sx={{
          visibility: requiredFields && !inputs.mainImage ? 'visible' : 'hidden',
          width: '100%',
          fontSize: '12px',
          // my: '3px',
        }}
      >
        Required
      </Typography>
      <Box
        sx={{
          position: 'relative',
          border: '1px solid #bdc5c9ff',
          width: { xs: '100%', sm: '250px' },
          height: { xs: `${height - 10}px`, sm: '250px' },
          p: '10px',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          boxSizing: 'border-box',
        }}
      >
        {inputs.mainImage && (
          <>
            <CloseOutlinedIcon
              onClick={() => setInputs({ ...inputs, mainImage: '' })}
              sx={{ bgcolor: 'red', position: 'absolute', top: 0, right: 0, color: 'white' }}
            />

            <NextImage
              src={mainImage}
              alt="Preview"
              width={200}
              height={200}
              style={{
                width: inputs.mainImage.height < inputs.mainImage.width ? '100%' : 'auto',
                height: inputs.mainImage.height >= inputs.mainImage.width ? '100%' : 'auto',
              }}
            />
          </>
        )}
      </Box>
      <div style={{ width: '100%', margin: '15px 0' }}>
        <Button
          sx={{ textTransform: 'capitalize' }}
          component="label"
          role={undefined}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload images
          <VisuallyHiddenInput
            accept="image/*"
            type="file"
            onChange={(event) => handleUploadImage(event.target.files)}
            multiple
          />
        </Button>
      </div>

      <Grid size={12} container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((img, index) => {
          return (
            <Box
              key={index}
              sx={{
                position: 'relative',
                border: '1px solid #bdc5c9ff',
                width: { xs: 'calc(50% - 10px)', sm: '150px' },
                height: { xs: `${height / 2 - 10}px`, sm: '150px' },
                // p: '10px',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                boxSizing: 'border-box',
              }}
            >
              {imagePreviews[index] && (
                <CloseOutlinedIcon
                  onClick={() => handleDeleteImage(index)}
                  sx={{ bgcolor: 'red', position: 'absolute', top: 0, right: 0, color: 'white' }}
                />
              )}
              {imagePreviews[index] && (
                <NextImage
                  src={imagePreviews[index]}
                  alt="Preview"
                  width={200}
                  height={200}
                  style={{
                    width: inputs.images[index].height < inputs.images[index].width ? '100%' : 'auto',
                    height: inputs.images[index].height >= inputs.images[index].width ? '100%' : 'auto',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Grid>
      <Button
        onClick={handleClick}
        color="success"
        sx={{ textTransform: 'capitalize', mt: '20px' }}
        variant="contained"
      >
        {buttonText}
      </Button>
    </Grid>
  );
}
