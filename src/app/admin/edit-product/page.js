'use client';

import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useAdminData } from '../_components/AdminContext';
import { useEffect, useState } from 'react';
// import getProduct from '@/app/_lib/firebase/getProduct';
import CategoriesInputs from '../_components/CategoriesInputs';
import { categoriesObj } from '../add-product/page';
import InitialProductInputs from '../_components/InitialProductInputs';
import ExtraProductOptions from '../_components/ExtraProductOptions';
import ImageInputs from '../_components/ImageInputs';
import DescriptionInput from '../_components/DescriptionInput';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import { db } from '@/firebase';
import { arrayRemove, deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { initialInputs } from '../add-product/page';
import { initialOptionInputs } from '../add-product/page';
import { getProduct } from '@/app/_lib/firebase/getProduct';

export default function EditProduct() {
  const [editedProduct, setEditedProduct] = useState({});
  const [initialAvailableOptions, setInitialAvailableOptions] = useState([]);
  const [removedOption, setRemovedOption] = useState([]);
  const [optionKeyValue, setOptionKeyValue] = useState('');
  const [inputs, setInputs] = useState(() => structuredClone(initialInputs));
  const [options, setOptions] = useState(() => structuredClone(initialOptionInputs));
  const [deletedImages, setDeletedImages] = useState([]);
  const [height, setHeight] = useState(0);
  const [requiredFields, setRequiredFields] = useState(false);
  const [requiredOption, setRequiredOption] = useState(false);
  const [product, setProduct] = useState(null);
  const { data, setLoading } = useAdminData();
  const router = useRouter();
  // console.log(data);

  const handleChangeNotes = (event, key) => {
    const {
      target: { value },
    } = event;
    setInputs({
      ...inputs,
      notes: {
        ...inputs.notes,
        [key]: typeof value === 'string' ? value.split(',') : value,
      },
    });
  };

  const handleDeleteItem = async () => {
    // console.log(editedProduct);
    const storage = getStorage();
    const deleteFolder = async (folderPath) => {
      const folderRef = ref(storage, folderPath);

      try {
        const list = await listAll(folderRef);

        // Delete all files
        await Promise.all(list.items.map((itemRef) => deleteObject(itemRef)));

        // If folder has subfolders, delete their files too
        await Promise.all(list.prefixes.map((subfolderRef) => deleteFolder(subfolderRef.fullPath)));

        console.log(`Deleted folder: ${folderPath}`);
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    };

    if (!product) {
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        initialAvailableOptions.map(async (item) => {
          const productRef = doc(db, 'glowyProducts', editedProduct.category, 'items', item.id);
          const allProductsRef = doc(db, 'allProducts', item.id);

          // const asd = await getDoc(allProductsRef);

          await updateDoc(productRef, {
            availableOptions: arrayRemove({ id: product, [inputs.optionKey]: inputs[inputs.optionKey] }),
          }).catch((e) => console.log(e));

          await updateDoc(allProductsRef, {
            availableOptions: arrayRemove({ id: product, [inputs.optionKey]: inputs[inputs.optionKey] }),
          }).catch((e) => console.log(e));
        })
      );

      const deletedItemref = doc(db, 'glowyProducts', editedProduct.category, 'items', product);
      const deletedItemAllref = doc(db, 'allProducts', product);

      await deleteDoc(deletedItemref).catch((e) => console.log(e));
      await deleteDoc(deletedItemAllref).catch((e) => console.log(e));

      const projectDetailsRef = doc(db, 'details', 'projectDetails');
      await updateDoc(projectDetailsRef, {
        [`allProductsIds.${product}`]: deleteField(),
      }).catch((e) => console.log(e));

      const folderRef = ref(storage, `glowyProducts/${product}`);
      await deleteFolder(folderRef);

      setInputs(() => structuredClone(initialInputs));
      setOptions(() => structuredClone(initialOptionInputs));
      setRequiredFields(false);
      setRequiredOption(false);
      setDeletedImages([]);
      setProduct(null);
      setEditedProduct({});
      setOptionKeyValue('');
      setRemovedOption([]);
      router.refresh();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const handleRemoveOption = (id) => {
    const updatedOptions = inputs.availableOptions.filter((item) => item.id !== id);
    if (inputs.availableOptions.length === 1) {
      if (options.availableOptions.length === 0) {
        setInputs((prev) => ({ ...prev, availableOptions: updatedOptions, extraInputs: {} }));
      } else {
        setInputs((prev) => ({ ...prev, availableOptions: updatedOptions }));
      }
      setOptions({ ...options, disabelOption: false });
    } else {
      setInputs((prev) => ({ ...prev, availableOptions: updatedOptions }));
    }

    setRemovedOption([...removedOption, id]);
  };

  const hadleChangeInputs = (e) => {
    if (e.target.name === 'category') {
      setInputs({
        ...inputs,
        category: e.target.value,
        subCategory: '',
        type: '',
      });
    } else if (e.target.name === 'subCategory') {
      if (e.target.value === 'fragrance') {
        setInputs({
          ...inputs,
          subCategory: e.target.value,
          type: '',
          notes: { base: [], middle: [], top: [] },
          allNotes: [],
        });
      } else {
        setInputs({
          ...inputs,
          subCategory: e.target.value,
          type: '',
        });
      }
    } else {
      if (e.target.type === 'number') {
        setInputs({ ...inputs, [e.target.name]: Number(e.target.value) });
      } else {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
      }
    }
  };

  const handleChangeOptions = (e) => {
    if (e.target.type === 'number') {
      setOptions({ ...options, [e.target.name]: Number(e.target.value) });
    } else {
      setOptions({ ...options, [e.target.name]: e.target.value });
    }
  };

  const editProduct = async () => {
    // console.log(inputs);
    // console.log(options);
    if (
      !product ||
      !inputs.brand ||
      !inputs.model ||
      !inputs.mainImage ||
      !inputs.category ||
      !inputs.subCategory ||
      (Object.keys(inputs.extraInputs)[0] && !inputs[Object.keys(inputs.extraInputs)[0]])
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
    const allProductids = {};
    function getNextProductId(id) {
      const next = parseInt(id, 10) + 1; // increase by 1
      return next.toString().padStart(6, '0'); // keep 7 digits
    }

    try {
      if (typeof inputs.mainImage.file !== 'string') {
        const mainImageStorageRef = ref(storage, `glowyProducts/${product}/main`);
        const smallImageStorageRef = ref(storage, `glowyProducts/${product}/small`);

        await uploadBytes(mainImageStorageRef, inputs.mainImage.file).then((snapshot) => {
          return getDownloadURL(snapshot.ref).then((url) => {
            mainImage.file = url;
            mainImage.src = `glowyProducts/${product}/main`;
          });
        });

        await uploadBytes(smallImageStorageRef, inputs.smallImage.file).then((snapshot) => {
          return getDownloadURL(snapshot.ref).then((url) => {
            smallImage.file = url;
            smallImage.src = `glowyProducts/${product}/small`;
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

              const imageStorageRef = ref(storage, `glowyProducts/${product}/images/${imgId}`);

              await uploadBytes(imageStorageRef, img.file).then((snapshot) => {
                return getDownloadURL(snapshot.ref).then((url) => {
                  imageArr.push({
                    ...img,
                    file: url,
                    id: imgId,
                    src: `glowyProducts/${product}/images/${imgId}`,
                  });
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
            const desertRef = ref(storage, `glowyProducts/${product}/images/${img}`);
            deleteObject(desertRef).catch((e) => console.log(e));
          } catch (error) {
            console.log(error);
          }
        })
      );

      let initialProduct = structuredClone(inputs);
      initialProduct.optionKey = Object.keys(inputs.extraInputs)[0] || '';
      delete initialProduct.extraInputs;

      initialProduct = {
        ...initialProduct,
        updatedAt: Date.now(),
        mainImage: mainImage,
        smallImage: smallImage,
        images: imageArr,
        name: `${initialProduct.brand} - ${initialProduct.model}`,
      };
      if (initialProduct.notes) {
        initialProduct.allNotes = [
          ...initialProduct.notes.top,
          ...initialProduct.notes.base,
          ...initialProduct.notes.middle,
        ];
      }

      allProductids[product] = initialProduct.brand + ' - ' + initialProduct.model;

      let startId = data.projectDetails.lastProductId;
      let lastProductId = data.projectDetails.lastProductId;

      const availableOptionItems = options.availableOptions.map((option, index) => {
        const id = getNextProductId(startId);
        allProductids[id] = initialProduct.brand + ' - ' + initialProduct.model;
        const item = {
          ...initialProduct,
          id: id,
          price: option.optionPrice,
          coast: option.optionCoast,
          previousPrice: option.optionPreviousPrice,
          qouantity: option.optionQouantity,
          inStock: option.inStock,
          mainImage: option.mainImage,
          smallImage: option.smallImage,
          images: [...option.images],
          [option.optionKey]: option.optionValue,
        };
        startId = id;
        if (index === options.availableOptions.length - 1) {
          lastProductId = id;
        }
        return item;
      });

      const idOptionArr = [];

      availableOptionItems.forEach((option, index) => {
        const availabeleIds = availableOptionItems
          .filter((f, i) => i !== index)
          .map((item) => ({ id: item.id, [item.optionKey]: item[item.optionKey] }));

        availableOptionItems[index].availableOptions = [
          ...availabeleIds,
          ...inputs.availableOptions,
          { id: product, [initialProduct.optionKey]: initialProduct[initialProduct.optionKey] },
        ];
        idOptionArr.push({ id: option.id, [option.optionKey]: option[option.optionKey] });
      });

      await Promise.all(
        availableOptionItems.map(async (item, index) => {
          let smallOptionImage = {};
          let mainOptionImage = {};
          const optionImageArr = [];

          try {
            const mainRef = ref(storage, `glowyProducts/${item.id}/main`);
            const smallRef = ref(storage, `glowyProducts/${item.id}/small`);

            if (item.mainImage.file) {
              await uploadBytes(mainRef, item.mainImage.file).then((snapshot) => {
                return getDownloadURL(snapshot.ref).then((url) => {
                  mainOptionImage = { ...item.mainImage, file: url, src: `glowyProducts/${item.id}/main` };
                });
              });
              availableOptionItems[index].mainImage = mainOptionImage;
            } else {
              availableOptionItems[index].mainImage = { ...initialProduct.mainImage };
            }

            if (item.smallImage.file) {
              await uploadBytes(smallRef, item.smallImage.file).then((snapshot) => {
                return getDownloadURL(snapshot.ref).then((url) => {
                  smallOptionImage = {
                    ...item.smallImage,
                    file: url,
                    src: `glowyProducts/${item.id}/small`,
                  };
                });
              });
              availableOptionItems[index].smallImage = smallOptionImage;
            } else {
              availableOptionItems[index].smallImage = { ...initialProduct.smallImage };
            }

            if (item.images.length > 0) {
              await Promise.all(
                item.images.map(async (img, index) => {
                  try {
                    const imageStorageRef = ref(storage, `glowyProducts/${item.id}/images/${index}`);
                    await uploadBytes(imageStorageRef, img.file).then((snapshot) => {
                      return getDownloadURL(snapshot.ref).then((url) => {
                        optionImageArr.push({
                          ...item.images[index],
                          file: url,
                          id: index,
                          src: `glowyProducts/${item.id}/images/${index}`,
                        });
                      });
                    });
                  } catch (error) {
                    console.log(error);
                  }
                })
              );
              availableOptionItems[index].images = [...optionImageArr];
            } else {
              availableOptionItems[index].images = [...initialProduct.images];
            }
          } catch (error) {
            console.log(error);
          }
        })
      );

      if (
        availableOptionItems.length > 0 ||
        optionKeyValue !== initialProduct[initialProduct.optionKey] ||
        removedOption.length > 0
      ) {
        await Promise.all(
          initialProduct.availableOptions.map(async (item, index) => {
            const options = initialProduct.availableOptions.filter((it, i) => i !== index);
            options.push(
              {
                id: initialProduct.id,
                [initialProduct.optionKey]: initialProduct[initialProduct.optionKey],
              },
              ...idOptionArr
            );
            const allProductsRef = doc(db, 'allProducts', item.id);
            const productRef = doc(db, 'glowyProducts', editedProduct.category, 'items', item.id);
            await updateDoc(productRef, {
              availableOptions: options,
            });
            await updateDoc(allProductsRef, {
              availableOptions: options,
            });
          })
        );

        await Promise.all(
          availableOptionItems.map(async (item, index) => {
            const allProductsRef = doc(db, 'allProducts', item.id);
            const productRef = doc(db, 'glowyProducts', item.category, 'items', item.id);
            await setDoc(productRef, {
              ...item,
              highlighted: (initialProduct.availableOptions.length + index) * -1,
            });
            await setDoc(allProductsRef, {
              ...item,
              highlighted: (initialProduct.availableOptions.length + index) * -1,
            });
          })
        );

        initialProduct.availableOptions.push(...idOptionArr);
      }

      await Promise.all(
        removedOption.map(async (item, index) => {
          const productRef = doc(db, 'glowyProducts', initialProduct.category, 'items', item);
          const allProductsRef = doc(db, 'allProducts', item);
          await updateDoc(productRef, {
            availableOptions: [],
          });
          await updateDoc(allProductsRef, {
            availableOptions: [],
          });
        })
      );

      const allProductsRef = doc(db, 'allProducts', product);

      const InitialProductRef = doc(db, 'glowyProducts', initialProduct.category, 'items', product);
      const detailRef = doc(db, 'details', 'projectDetails');

      await setDoc(InitialProductRef, initialProduct);
      await setDoc(allProductsRef, initialProduct);
      const updateData = {};

      Object.entries(allProductids).forEach(([key, value]) => {
        updateData[`allProductsIds.${key}`] = value;
      });

      updateData.lastProductId = lastProductId;
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      await updateDoc(detailRef, updateData);

      setInputs(() => structuredClone(initialInputs));
      setOptions(() => structuredClone(initialOptionInputs));
      setRequiredFields(false);
      setRequiredOption(false);
      setDeletedImages([]);
      setProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setOptionKeyValue('');
      setRemovedOption([]);
      setLoading(false);
      router.refresh();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    setDeletedImages([]);
    setRemovedOption([]);
    if (product) {
      setLoading(true);
      getProduct(product).then((data) => {
        if (data.brand) {
          setEditedProduct(data);
          setInitialAvailableOptions(data.availableOptions || []);
          if (data.availableOptions.length > 0) {
            setInputs({ ...data, extraInputs: { [data.optionKey]: data.optionKey } });
            setOptions({
              ...structuredClone(initialOptionInputs),
              optionKey: data.optionKey,
              disabelOption: true,
            });
            setOptionKeyValue(data[data.optionKey]);
          } else {
            setInputs({ ...data, extraInputs: {} });
            setOptions({ ...structuredClone(initialOptionInputs), disabelOption: false });
            setOptionKeyValue('');
          }
        } else {
          setInputs(structuredClone(initialInputs));
          setOptions(structuredClone(initialOptionInputs));
          setOptionKeyValue('');
        }
        setLoading(false);
      });
    } else {
      setInitialAvailableOptions([]);
    }
  }, [product]);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerWidth);
    handleResize(); // set initial height
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (inputs.qouantity > 0 && !inputs.inStock) {
      setInputs({ ...inputs, inStock: true });
    } else if (inputs.qouantity <= 0 && inputs.inStock) {
      setInputs({ ...inputs, inStock: false });
    }
  }, [inputs.qouantity]);

  useEffect(() => {
    if (options.optionQouantity > 0 && !options.inStock) {
      setOptions({ ...options, inStock: true });
    } else if (options.optionQouantity <= 0 && options.inStock) {
      setOptions({ ...options, inStock: false });
    }
  }, [options.optionQouantity]);
  return (
    <Grid
      sx={{
        p: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' },
        boxSizing: 'border-box',
        mt: '20px',
        position: 'relative',
      }}
      minHeight={'100vh'}
      alignContent={'flex-start'}
      container
      size={12}
    >
      <Button
        sx={{ position: 'sticky', top: '100px', zIndex: 100000 }}
        variant="contained"
        onClick={async () => {
          console.log('inputs', inputs);
          console.log('product', product);
          console.log('deletedImages', deletedImages);
          console.log('options', options);
          console.log('optionKeyValue', optionKeyValue);
          console.log('removedOption', removedOption);
          console.log('initialAvailableOptions', initialAvailableOptions);
          // console.log('initialAvailableOptions', requiredFields);
        }}
      >
        asd
      </Button>
      <Typography sx={{ fontSize: '22px', fontWeight: 500, width: '100%' }}>Edit product</Typography>
      <Typography sx={{ fontSize: '16px', fontWeight: 500, width: '100%', textAlign: 'center', my: '20px' }}>
        Type Product Name or Id
      </Typography>

      <Autocomplete
        size="small"
        options={Object.keys(data.projectDetails.allProductsIds).sort() || []}
        // options={[]}
        getOptionLabel={(option) => `${option} - ${data.projectDetails.allProductsIds[option]}`}
        value={product}
        onChange={(event, newValue) => setProduct(newValue)}
        renderInput={(params) => (
          <TextField
            error={!product && requiredFields ? true : false}
            {...params}
            label="Select product"
            placeholder="Choose..."
          />
        )}
        sx={{
          width: { xs: '100%', sm: '400px' },
          m: '0 auto',
        }}
      />
      <Button
        disabled={!product}
        onClick={() => handleDeleteItem()}
        sx={{ textTransform: 'capitalize', mt: { xs: '15px', sm: 0 } }}
        variant="contained"
        color="error"
      >
        Delete Item
      </Button>
      <Grid
        sx={{
          maxWidth: '1150px',
          margin: '0 auto',
          flexWrap: 'wrap',
          overflow: 'hidden',
          mt: '50px',
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
          handleChangeNotes={handleChangeNotes}
          notes={data.projectDetails.perfumeNotes}
          inputs={inputs}
          hadleChangeInputs={hadleChangeInputs}
          suppliers={data.suppliers?.suppliers || {}}
          brands={categoriesObj?.[inputs.category]?.[inputs.subCategory]?.brands || []}
          requiredFields={requiredFields}
        />
        {inputs.extraInputs && Object.keys(inputs.extraInputs).length !== 0 && (
          <div style={{ width: '100%' }}>
            <Typography mb="10px">Extra Inputs</Typography>

            {Object.keys(inputs.extraInputs).map((key, index) => {
              if (key !== 'size')
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

        <>
          {inputs.availableOptions?.length > 0 && (
            <div
              style={{
                width: '100%',
                padding: '15px',
                display: 'flex',
                flexWrap: 'wrap',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                marginBottom: '15px',
              }}
            >
              <Typography sx={{ width: '100%' }}>Available Options</Typography>
              {inputs.availableOptions.map((item, index) => {
                return (
                  <div
                    style={{
                      margin: '9px',
                      padding: '15px 30px',
                      border: 'solid 0.5px',
                      borderRadius: '8px',
                      position: 'relative',
                    }}
                    key={index}
                  >
                    <CloseOutlinedIcon
                      onClick={() => handleRemoveOption(item.id)}
                      sx={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', color: 'red' }}
                    />
                    <Typography
                      sx={{ cursor: 'pointer', textDecoration: 'underline', color: '#2196f3' }}
                      onClick={() => setProduct(item.id)}
                    >
                      Id - {item.id}
                    </Typography>
                    <Typography>
                      {inputs.optionKey} - {item[inputs.optionKey]}
                    </Typography>
                  </div>
                );
              })}
            </div>
          )}
        </>

        <ExtraProductOptions
          requiredOption={requiredOption}
          setRequiredOption={setRequiredOption}
          inputs={inputs}
          setInputs={setInputs}
          options={options}
          setOptions={setOptions}
          handleChangeOptions={handleChangeOptions}
          setLoading={setLoading}
          optionKey={inputs.optionKey}
        />
        <ImageInputs
          requiredFields={requiredFields}
          inputs={inputs}
          setInputs={setInputs}
          height={height}
          setLoading={setLoading}
          setDeletedImages={setDeletedImages}
          deletedImages={deletedImages}
        />
        <DescriptionInput inputs={inputs} hadleChangeInputs={hadleChangeInputs} />
        <Button
          disabled={!product}
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