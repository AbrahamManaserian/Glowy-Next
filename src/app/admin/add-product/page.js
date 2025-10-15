'use client';

import { categories } from '@/components/ui/CategoriesDekstop';
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
import Resizer from 'react-image-file-resizer';

const resizeFile = (file, quality) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1100,
      1100,
      'JPEG',
      quality,
      0,
      (uri) => {
        resolve(uri);
      },
      'file'
    );
  });

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

import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import NextImage from 'next/image';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const categoriesObj = categories;

export default function AddProduct() {
  const [lastProductId, setLastProductId] = useState('');
  const [height, setHeight] = useState(0);
  const [requiredFields, setRequiredFields] = useState(false);
  const [testImage, setTestImage] = useState({ small: '', main: '' });
  const [inputs, setInputs] = useState({
    name: '',
    category: '',
    subCategory: '',
    type: '',
    description: '',
    descriptionEn: '',
    descriptionRu: '',
    images: [],
    price: null,
    disacuntedPrice: null,
    smallImage: '',
    mainImage: '',
    inStock: true,
    quantity: null,
    supplier: '',
    cost: null,
  });

  useEffect(() => {
    const getLastProductId = async () => {
      const docRef = doc(db, 'details', 'last-id');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log('Document data:', docSnap.data());
        setLastProductId(docSnap.data().num);
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!');
        setLastProductId('000000');
      }
    };
    getLastProductId();
  }, []);

  useEffect(() => {
    setRequiredFields(false);
    const handleResize = () => setHeight(window.innerWidth);
    handleResize(); // set initial height
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [inputs]);

  const handleChangeCategory = (event) => {
    // console.log(categoriesObj[event.target.value]);
    setInputs({ ...inputs, category: event.target.value, subCategory: '', type: '' });
  };

  const handleChangeSubCategory = (event) => {
    setInputs({ ...inputs, subCategory: event.target.value, type: '' });
  };

  const handleChangeType = (event) => {
    setInputs({ ...inputs, type: event.target.value });
  };

  const handleUploadImage = (files) => {
    const items = Array.from(files);
    const fileArray = items.slice(0, 6 - inputs.images.length);

    const loadImage = (file) =>
      new Promise(async (resolve) => {
        const smallImage = await resizeFile(file, 50);
        // console.log(file.size / smallImage.size);
        // console.log(file.size / 1024, smallImage.size / 1024);
        // setTestImage({ small: smallImage, main: file });
        const img = new Image();
        img.src = URL.createObjectURL(smallImage);

        img.onload = () => {
          resolve({ file: smallImage, width: img.width, height: img.height });
          URL.revokeObjectURL(img.src); // cleanup
        };
      });

    Promise.all(fileArray.map(loadImage)).then((loadedImages) => {
      // console.log(loadedImages);
      setInputs((prev) => ({
        ...prev,
        images: prev.images.concat(loadedImages),
      }));
    });
  };

  const handleDeleteImage = (index) => {
    setInputs({ ...inputs, images: inputs.images.filter((_, i) => i !== index) });
  };

  const hadleChangeInputs = async (e) => {
    if (e.target.name === 'mainImage') {
      const smallImage = await resizeFile(e.target.files[0], 20);
      const bigImage = await resizeFile(e.target.files[0], 50);
      const smallImageLoad = new Image();
      smallImageLoad.src = URL.createObjectURL(smallImage);
      smallImageLoad.onload = () => {
        const imageDetail = { file: smallImage, width: smallImageLoad.width, height: smallImageLoad.height };

        const img = new Image();
        img.src = URL.createObjectURL(bigImage);

        img.onload = () => {
          // console.log(img.height, img.width);
          setInputs({
            ...inputs,
            mainImage: { file: bigImage, width: img.width, height: img.height },
            smallImage: imageDetail,
          });
          URL.revokeObjectURL(img.src); // cleanup
        };
        URL.revokeObjectURL(smallImageLoad.src); // cleanup
      };
    } else {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
  };

  const mainImage = useMemo(() => {
    if (inputs.mainImage) return URL.createObjectURL(inputs.mainImage.file);
  }, [inputs.mainImage]);

  const imagePreviews = useMemo(() => {
    return inputs.images.map((i) => URL.createObjectURL(i.file));
  }, [inputs.images]);

  const handleAddProduct = async () => {
    if (!lastProductId) return;

    // if (
    //   !inputs.name ||
    //   !inputs.category ||
    //   !inputs.subCategory ||
    //   !inputs.type ||
    //   !inputs.images[0] ||
    //   !inputs.price ||
    //   !inputs.disacuntedPrice ||
    //   !inputs.mainImage ||
    //   !inputs.quantity ||
    //   !inputs.supplier
    // ) {
    //   setRequiredFields(true);
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    //   // alert('asd');
    //   return;
    // }

    function getNextProductId() {
      const next = parseInt(lastProductId, 10) + 1; // increase by 1
      return next.toString().padStart(7, '0'); // keep 7 digits
    }

    const newId = getNextProductId();

    setLastProductId(newId);
    const publicProductRef = doc(db, 'public-products', newId);
    const mainProductRef = doc(db, 'main-products', newId);
    const publicObj = {
      name: inputs.name,
      category: inputs.category,
      subCategory: inputs.subCategory,
      type: inputs.type,
      description: inputs.description,
      descriptionEn: inputs.descriptionEn,
      descriptionRu: inputs.descriptionRu,
      images: inputs.images,
      price: inputs.price,
      disacuntedPrice: inputs.disacuntedPrice,
      smallImage: inputs.smallImage,
      mainImage: inputs.mainImage,
      inStock: inputs.inStock,
      quantity: inputs.quantity,
    };
    // await setDoc(doc(db, 'glowyproducts', newId), {
    //   name: 'Los Angeles',
    //   state: 'CA',
    //   country: 'USA',
    // });
    // await setDoc(doc(db, 'details', 'last-id'), {
    //   num: newId,
    // });
  };

  return (
    <Grid
      sx={{
        p: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' },
        boxSizing: 'border-box',
      }}
      minHeight={'100vh'}
      alignContent={'flex-start'}
      container
      size={12}
    >
      <Typography sx={{ fontSize: '22px', fontWeight: 500, width: '100%' }}>Add new product</Typography>
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
          error={!!requiredFields && !inputs.name}
          defaultValue={inputs.name}
          name="name"
          onBlur={(e) => hadleChangeInputs(e)}
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
          error={!!requiredFields && !inputs.subCategory}
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
          <FormHelperText>{requiredFields && !inputs.subCategory ? 'Required' : ' '}</FormHelperText>
        </FormControl>
        <FormControl
          error={!!requiredFields && !inputs.type}
          sx={{
            boxSizing: 'border-box',
            width: { xs: '100%', sm: 'calc(25%)' },
            // mb: '15px',
          }}
          size="small"
        >
          <InputLabel>Type</InputLabel>
          <Select
            disabled={inputs.subCategory ? false : true}
            value={inputs.type}
            label="Type"
            onChange={handleChangeType}
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
          <FormHelperText>{requiredFields && !inputs.type ? 'Required' : ' '}</FormHelperText>
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
          error={!!requiredFields && !inputs.disacuntedPrice}
          helperText={requiredFields && !inputs.disacuntedPrice ? 'Required' : ' '}
          defaultValue={inputs.disacuntedPrice}
          type="number"
          name="disacuntedPrice"
          onKeyDown={(e) => {
            if (['e', 'E', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onBlur={(e) => hadleChangeInputs(e)}
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
          error={!!requiredFields && !inputs.quantity}
          helperText={requiredFields && !inputs.quantity ? 'Required' : ' '}
          defaultValue={inputs.quantity}
          type="number"
          name="quantity"
          onKeyDown={(e) => {
            if (['e', 'E', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onBlur={(e) => hadleChangeInputs(e)}
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

        <TextField
          error={!!requiredFields && !inputs.supplier}
          helperText={requiredFields && !inputs.supplier ? 'Required' : ' '}
          defaultValue={inputs.supplier}
          name="supplier"
          onBlur={(e) => hadleChangeInputs(e)}
          sx={{
            boxSizing: 'border-box',
            width: { xs: '100%', sm: 'calc(20%)' },
            // mr: { xs: 0, sm: '10px' },
            // mb: '15px',
          }}
          size="small"
          label="Supplier"
          variant="outlined"
        />

        <TextField
          multiline={true}
          minRows={4}
          name="description"
          defaultValue={inputs.description}
          onBlur={(e) => hadleChangeInputs(e)}
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
                width={2}
                height={2}
                style={{
                  width: inputs.mainImage.height < inputs.mainImage.width ? '100%' : 'auto',
                  height: inputs.mainImage.height >= inputs.mainImage.width ? '100%' : 'auto',
                }}
              />
            </>
          )}
        </Box>
        <div style={{ width: '100%', marginTop: '15px' }}>
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
        <Typography
          color="error"
          sx={{
            visibility: requiredFields && !inputs.images[0] ? 'visible' : 'hidden',
            width: '100%',
            fontSize: '12px',
            lineHeight: '12px',
            my: '3px',
          }}
        >
          Required
        </Typography>
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
          onClick={handleAddProduct}
          color="success"
          sx={{ textTransform: 'capitalize', mt: '20px' }}
          variant="contained"
        >
          Add product
        </Button>

        {imagePreviews[0] && (
          <NextImage
            alt="Preview"
            src={imagePreviews[0]}
            width={200}
            height={200}
            style={{ width: '100%', height: 'auto', margin: '0 5px' }}
          />
        )}
      </Grid>
    </Grid>
  );
}
