'use client';

import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useAdminData } from '../components/AdminContext';
import { categories } from '@/components/ui/CategoriesDekstop';
import AddEditProductInputs from '../components/AddEditProductInputs';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import NextImage from 'next/image';

const categoriesObj = categories;

export default function ChangeProductPage() {
  const [height, setHeight] = useState(0);
  const [requiredFields, setRequiredFields] = useState(false);
  const [product, setProduct] = useState(null);
  const { data, setLoading } = useAdminData();

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
    quantity: null,
    supplier: '',
    cost: null,
  });
  console.log(inputs);

  useEffect(() => {
    if (product) {
      async function getProduct() {
        const productRef = doc(db, 'glowy-products', product.id);
        const productData = await getDoc(productRef);
        if (productData.exists()) {
          setInputs(productData.data());
        }
      }
      getProduct();
    } else {
      setInputs({
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
        quantity: null,
        supplier: '',
        cost: null,
      });
    }
  }, [product]);

  const handleChangeCategory = (event) => {
    // console.log(categoriesObj[event.target.value]);
    setInputs({ ...inputs, category: event.target.value, subCategory: '', type: '' });
  };

  const handleChangeSubCategory = (event) => {
    setInputs({ ...inputs, subCategory: event.target.value, type: '' });
  };

  const handleChangeSelect = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    // console.log(event.target.name);
  };

  const handleUploadImage = async (files) => {
    // const items = Array.from(files);
    // const fileArray = items.slice(0, 6 - inputs.images.length);
    // setLoading(true);
    // const loadImage = async (file) =>
    //   await new Promise(async (resolve) => {
    //     const smallImage = await resizeFile(file, 60);

    //     const img = new Image();
    //     img.src = URL.createObjectURL(smallImage);

    //     img.onload = () => {
    //       resolve({ file: smallImage, width: img.width, height: img.height });
    //       URL.revokeObjectURL(img.src); // cleanup
    //     };
    //   });

    // await Promise.all(fileArray.map(loadImage)).then((loadedImages) => {
    //   // console.log(loadedImages);
    //   setInputs((prev) => ({
    //     ...prev,
    //     images: prev.images.concat(loadedImages),
    //   }));
    // });
    setLoading(false);
  };

  const handleDeleteImage = (index) => {
    console.log(index);
  };
  // setInputs({ ...inputs, images: inputs.images.filter((_, i) => i !== index) });

  const hadleChangeInputs = async (e) => {
    // if (e.target.name === 'mainImage') {
    //   setLoading(true);
    //   const smallImage = await resizeFile(e.target.files[0], 20);
    //   const bigImage = await resizeFile(e.target.files[0], 60);
    //   setLoading(false);
    //   const smallImageLoad = new Image();
    //   smallImageLoad.src = URL.createObjectURL(smallImage);
    //   smallImageLoad.onload = () => {
    //     const imageDetail = { file: smallImage, width: smallImageLoad.width, height: smallImageLoad.height };
    //     setInputs({
    //       ...inputs,
    //       mainImage: { file: bigImage, width: smallImageLoad.width, height: smallImageLoad.height },
    //       smallImage: imageDetail,
    //     });
    //     URL.revokeObjectURL(smallImageLoad.src); // cleanup
    //   };
    // } else {
    //   setInputs({ ...inputs, [e.target.name]: e.target.value });
    // }
  };

  const mainImage = useMemo(() => {
    if (inputs.mainImage) {
      if (typeof inputs.mainImage.file === 'string') {
        return inputs.mainImage.file;
      } else {
        return URL.createObjectURL(inputs.mainImage.file);
      }
    }
  }, [inputs.mainImage]);

  const imagePreviews = useMemo(() => {
    // return inputs.images.map((i) => URL.createObjectURL(i.file));
    return [];
  }, [inputs.images]);

  const changeProduct = async () => {};
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
      <Typography sx={{ fontSize: '22px', fontWeight: 500, width: '100%' }}>Edit product</Typography>
      <Typography sx={{ fontSize: '16px', fontWeight: 500, width: '100%', textAlign: 'center', mt: '20px' }}>
        Type Product Name or Id
      </Typography>
      <Autocomplete
        size="small"
        options={data['project-details'].allProductsIds}
        getOptionLabel={(option) => `${option.id} - ${option.name}`}
        value={product}
        onChange={(event, newValue) => setProduct(newValue)}
        renderInput={(params) => <TextField {...params} label="Select product" placeholder="Choose..." />}
        sx={{ width: { xs: '100%', sm: '400px' }, m: '20px auto' }}
      />

      <AddEditProductInputs
        inputs={inputs}
        requiredFields={requiredFields}
        hadleChangeInputs={hadleChangeInputs}
        setInputs={setInputs}
        handleChangeCategory={handleChangeCategory}
        categoriesObj={categories}
        handleChangeSubCategory={handleChangeSubCategory}
        handleChangeSelect={handleChangeSelect}
        data={data.suppliers}
        handleUploadImage={handleUploadImage}
        // imagePreviews={imagePreviews}
        imagePreviews={[]}
        height={height}
        mainImage={mainImage}
        handleDeleteImage={handleDeleteImage}
        handleClick={changeProduct}
        buttonText="Add Product"
      />
    </Grid>
  );
}
