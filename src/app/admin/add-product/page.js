'use client';

import { Grid, Typography } from '@mui/material';
import AddEditProductInputs from '../components/AddEditProductInputs';
import { useEffect, useState } from 'react';
import { useAdminData } from '../components/AdminContext';
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

export default function AddProductPage() {
  const [height, setHeight] = useState(0);
  const { data, setLoading } = useAdminData();
  const [requiredFields, setRequiredFields] = useState(false);
  const [inputs, setInputs] = useState({
    name: '',
    category: '',
    subCategory: '',
    subCategory: '',
    brand: '',
    type: '',
    coast: '',
    price: '',
    disacountedPrice: '',
    qouantity: '',
    supplier: '',
    images: [],
    smallImage: '',
    mainImage: '',
    descriptionAm: '',
    descriptionEn: '',
    descriptionRu: '',
  });
  const hadleChangeInputs = (e) => {
    if (e.target.name === 'category') {
      setInputs({
        name: '',
        category: e.target.value,
        subCategory: '',
        brand: '',
        type: '',
        coast: '',
        price: '',
        disacountedPrice: '',
        qouantity: '',
        supplier: '',
        images: [],
        smallImage: '',
        mainImage: '',
        descriptionAm: '',
        descriptionEn: '',
        descriptionRu: '',
      });
    } else if (e.target.name === 'subCategory') {
      setInputs({
        name: inputs.name,
        category: inputs.category,
        subCategory: e.target.value,
        brand: '',
        type: '',
        coast: '',
        price: '',
        disacountedPrice: '',
        qouantity: '',
        supplier: '',
        images: [],
        smallImage: '',
        mainImage: '',
        descriptionAm: '',
        descriptionEn: '',
        descriptionRu: '',
      });
    } else {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
  };

  const handleUploadMainImage = async (e) => {
    // console.log(e.target.files);
    const input = e.target;
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoading(true);
      const smallImage = await resizeFile(file, 20);
      const bigImage = await resizeFile(file, 60);
      setLoading(false);
      const smallImageLoad = new Image();
      smallImageLoad.src = URL.createObjectURL(smallImage);
      smallImageLoad.onload = () => {
        const imageDetails = { file: smallImage, width: smallImageLoad.width, height: smallImageLoad.height };
        setInputs({
          ...inputs,
          mainImage: { file: bigImage, width: smallImageLoad.width, height: smallImageLoad.height },
          smallImage: imageDetails,
        });

        URL.revokeObjectURL(smallImageLoad.src); // cleanup
      };
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUploadImages = async (files) => {
    const items = Array.from(files);
    const fileArray = items.slice(0, 6 - inputs.images.length);
    setLoading(true);
    const loadImage = async (file) =>
      await new Promise(async (resolve) => {
        const smallImage = await resizeFile(file, 60);

        const img = new Image();
        img.src = URL.createObjectURL(smallImage);

        img.onload = () => {
          resolve({ file: smallImage, width: img.width, height: img.height });
          URL.revokeObjectURL(img.src); // cleanup
        };
      });

    await Promise.all(fileArray.map(loadImage)).then((loadedImages) => {
      // console.log(loadedImages);
      setInputs((prev) => ({
        ...prev,
        images: prev.images.concat(loadedImages),
      }));
    });
    setLoading(false);
  };

  const handleClick = async () => {
    console.log(inputs);
  };

  useEffect(() => {
    const handleResize = () => setHeight(window.innerWidth);
    handleResize(); // set initial height
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Grid
      sx={{
        p: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' },
        boxSizing: 'border-box',
        mt: '20px',
      }}
      minHeight={'100vh'}
      alignContent={'flex-start'}
      container
      size={12}
    >
      <Typography sx={{ fontSize: '22px', fontWeight: 500, width: '100%' }}>Add new product</Typography>
      <AddEditProductInputs
        handleUploadMainImage={handleUploadMainImage}
        handleUploadImages={handleUploadImages}
        data={data.suppliers}
        inputs={inputs}
        setInputs={setInputs}
        requiredFields={requiredFields}
        hadleChangeInputs={hadleChangeInputs}
        buttonText="Add Product"
        height={height}
        handleClick={handleClick}
      />
    </Grid>
  );
}
