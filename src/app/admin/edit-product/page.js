'use client';

import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { useAdminData } from '../components/AdminContext';
import { useEffect, useState } from 'react';
import getProduct from '@/app/lib/firebase/getProduct';
import CategoriesInputs from '../components/CategoriesInputs';
import { categoriesObj, resizeFile } from '../add-product/page';
import InitialProductInputs from '../components/InitialProductInputs';
import ExtraProductOptions from '../components/ExtraProductOptions';
import ImageInputs from '../components/ImageInputs';
import DescriptionInput from '../components/DescriptionInput';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function EditProduct() {
  const [deletedImages, setDeletedImages] = useState([]);
  const [height, setHeight] = useState(0);
  const [requiredFields, setRequiredFields] = useState(false);
  const [requiredOption, setRequiredOption] = useState(false);
  const [product, setProduct] = useState(null);
  const [inputs, setInputs] = useState({
    category: '',
    subCategory: '',
    brand: '',
    model: '',
    size: '',
    unit: '',
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
    extraInputs: {},
  });

  const [options, setOptions] = useState({
    optionKey: '',
    optionValue: '',
    optionPrice: '',
    optionDisacountedPrice: '',
    optionCoast: '',
    optionQouantity: '',
    availableOptions: [],
  });
  const { data, setLoading } = useAdminData();
  const router = useRouter();

  const hadleChangeInputs = (e) => {
    if (e.target.name === 'category') {
      setInputs({
        category: e.target.value,
        subCategory: '',
        brand: '',
        model: '',
        size: '',
        unit: '',
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
        extraInputs: {},
      });
      setOptions({
        optionKey: '',
        optionValue: '',
        optionPrice: '',
        optionDisacountedPrice: '',
        optionCoast: '',
        optionQouantity: '',
        availableOptions: [],
      });
    } else if (e.target.name === 'subCategory') {
      setInputs({
        category: inputs.category,
        subCategory: e.target.value,
        brand: '',
        model: '',
        size: '',
        unit: '',
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
        extraInputs: {},
      });
      setOptions({
        optionKey: '',
        optionValue: '',
        optionPrice: '',
        optionDisacountedPrice: '',
        optionCoast: '',
        optionQouantity: '',
        availableOptions: [],
      });
    } else {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
  };

  const handleChangeOptions = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };

  const handleUploadMainImage = async (e) => {
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
        const imageDetails = {
          file: smallImage,
          width: smallImageLoad.width,
          height: smallImageLoad.height,
        };
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
      setInputs((prev) => ({
        ...prev,
        images: prev.images.concat(loadedImages),
      }));
    });
    setLoading(false);
  };

  const handleDeleteImage = (index) => {
    if (typeof inputs.images[index].file === 'string') {
      setDeletedImages([...deletedImages, inputs.images[index].id]);
    }
    setInputs({ ...inputs, images: inputs.images.filter((_, i) => i !== index) });
  };

  const editProduct = async () => {
    if (
      !product ||
      !inputs.brand ||
      !inputs.model ||
      !inputs.mainImage ||
      !inputs.category ||
      !inputs.subCategory
    ) {
      setRequiredFields(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setLoading(true);
    const storage = getStorage();
    const imageArr = [];
    let mainImage = { ...inputs.mainImage };
    let smallImage = { ...inputs.smallImage };
    setLoading(true);
    try {
      if (typeof inputs.mainImage.file !== 'string') {
        const mainImageStorageRef = ref(storage, `glowy-products/${product}/main`);
        const smallImageStorageRef = ref(storage, `glowy-products/${product}/small`);

        await uploadBytes(mainImageStorageRef, inputs.mainImage.file).then((snapshot) => {
          return getDownloadURL(snapshot.ref).then((url) => {
            mainImage.file = url;
            // console.log(url);
          });
        });

        await uploadBytes(smallImageStorageRef, inputs.smallImage.file).then((snapshot) => {
          return getDownloadURL(snapshot.ref).then((url) => {
            smallImage.file = url;
            // console.log(url);
          });
        });
      }
      const usedIds = inputs.images.map((item) => item.id);
      const availableImgIds = [];
      [0, 1, 2, 3, 4, 5].forEach((item, index) => {
        if (!usedIds.includes(item) && !deletedImages.includes(item)) {
          availableImgIds.push(item);
        }
      });

      await Promise.all(
        inputs.images.map(async (img, index) => {
          if (typeof img.file !== 'string') {
            try {
              let imgId = deletedImages.length > 0 ? deletedImages[deletedImages.length - 1] : null;
              if (imgId === null) {
                imgId = availableImgIds[availableImgIds.length - 1];
                availableImgIds.pop();
              }
              deletedImages.pop();

              const imageStorageRef = ref(storage, `glowy-products/${product}/images/${imgId}`);

              await uploadBytes(imageStorageRef, img.file).then((snapshot) => {
                return getDownloadURL(snapshot.ref).then((url) => {
                  imageArr.push({ ...img, file: url, id: imgId });
                  // console.log(url);
                });
              });
            } catch (error) {
              console.log(error);
            }
          } else {
            imageArr.push(img);
          }
        })
      );

      await Promise.all(
        deletedImages.map(async (img, index) => {
          try {
            const desertRef = ref(storage, `glowy-products/${product}/images/${img}`);
            deleteObject(desertRef);
          } catch (error) {
            console.log(error);
          }
        })
      );
      const productRef = doc(db, 'glowy-products', product);
      const detailRef = doc(db, 'details', 'project-details');

      await setDoc(productRef, {
        ...inputs,
        updatedAt: Date.now(),
        mainImage: mainImage,
        smallImage: smallImage,
        images: imageArr,
      });
      await updateDoc(detailRef, {
        [`allProductsIds.${product}`]: inputs.brand + ' - ' + inputs.model,
      });
      setProduct(null);
      setInputs({
        category: '',
        subCategory: '',
        brand: '',
        model: '',
        size: '',
        unit: '',
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
        extraInputs: {},
      });
      setOptions({
        optionKey: '',
        optionValue: '',
        optionPrice: '',
        optionDisacountedPrice: '',
        optionCoast: '',
        optionQouantity: '',
        availableOptions: [],
      });
      setRequiredFields(false);
      setRequiredOption(false);
      setDeletedImages([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      router.refresh();
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    setDeletedImages([]);
    if (product) {
      setLoading(true);
      getProduct(product).then((data) => {
        setLoading(false);
        setInputs(data);
        setOptions({ ...options, availableOptions: data.availableOptions });
      });
    }
  }, [product]);

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
      <Typography sx={{ fontSize: '22px', fontWeight: 500, width: '100%' }}>Edit product</Typography>
      <Typography sx={{ fontSize: '16px', fontWeight: 500, width: '100%', textAlign: 'center', mt: '20px' }}>
        Type Product Name or Id
      </Typography>
      <Autocomplete
        size="small"
        options={Object.keys(data['project-details'].allProductsIds) || []}
        getOptionLabel={(option) => `${option} - ${data['project-details'].allProductsIds[option]}`}
        value={product}
        onChange={(event, newValue) => setProduct(newValue)}
        renderInput={(params) => <TextField {...params} label="Select product" placeholder="Choose..." />}
        sx={{ width: { xs: '100%', sm: '400px' }, m: '20px auto' }}
      />
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
        <CategoriesInputs
          inputs={inputs}
          requiredFields={requiredFields}
          hadleChangeInputs={hadleChangeInputs}
          categoriesObj={categoriesObj}
        />
        <InitialProductInputs
          inputs={inputs}
          hadleChangeInputs={hadleChangeInputs}
          suppliers={data.suppliers.suppliers || {}}
          brands={categoriesObj?.[inputs.category]?.[inputs.subCategory]?.brands || []}
          requiredFields={requiredFields}
        />
        {inputs.extraInputs && Object.keys(inputs.extraInputs).length !== 0 && (
          <div style={{ width: '100%' }}>
            <Typography mb="10px">Extra Inputs</Typography>

            {Object.keys(inputs.extraInputs).map((key, index) => {
              return (
                <TextField
                  key={index}
                  defaultValue={inputs[key]}
                  name={key}
                  onBlur={(e) => hadleChangeInputs(e)}
                  onChange={(e) => {
                    if (!e.nativeEvent.data && e.nativeEvent.data !== null) {
                      hadleChangeInputs(e);
                    }
                  }}
                  sx={{
                    boxSizing: 'border-box',
                    width: { xs: 'calc(50% - 10px)', sm: 'calc(20% - 10px)' },
                    mr: { xs: 0, sm: '10px' },
                    mr: '10px',

                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                      {
                        WebkitAppearance: 'none', // Chrome, Safari, Edge
                      },
                  }}
                  size="small"
                  label={inputs.extraInputs[key]}
                  variant="outlined"
                  error={!inputs[key] && requiredFields ? true : false}
                  helperText={!inputs[key] && requiredFields ? 'Required' : ' '}
                />
              );
            })}
          </div>
        )}
        <ExtraProductOptions
          requiredOption={requiredOption}
          setRequiredOption={setRequiredOption}
          inputs={inputs}
          setInputs={setInputs}
          options={options}
          setOptions={setOptions}
          handleChangeOptions={handleChangeOptions}
        />
        <ImageInputs
          requiredFields={requiredFields}
          inputs={inputs}
          setInputs={setInputs}
          handleUploadMainImage={handleUploadMainImage}
          handleUploadImages={handleUploadImages}
          height={height}
          handleDeleteImage={handleDeleteImage}
        />
        <DescriptionInput inputs={inputs} hadleChangeInputs={hadleChangeInputs} />
        <Button
          onClick={editProduct}
          color="success"
          sx={{ textTransform: 'capitalize', mt: '20px' }}
          variant="contained"
        >
          Edit Product
        </Button>
      </Grid>
    </Grid>
  );
}
