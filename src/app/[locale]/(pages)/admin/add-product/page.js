'use client';

import { Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import ExtraProductOptions from '../_components/ExtraProductOptions';
import { useEffect, useState } from 'react';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '@/firebase';

import InitialProductInputs from '../_components/InitialProductInputs';
import CategoriesInputs from '../_components/CategoriesInputs';
import DescriptionInput from '../_components/DescriptionInput';
import ImageInputs from '../_components/ImageInputs';
import { getAdminData } from '@/_lib/firebase/getAdminData';

export const initialInputs = {
  category: '',
  subCategory: '',
  brand: '',
  model: '',
  size: '',
  unit: '',
  type: '',
  coast: '',
  price: '',
  previousPrice: '',
  qouantity: 1,
  supplier: '',
  images: [],
  smallImage: '',
  mainImage: '',
  descriptionAm: '',
  descriptionEn: '',
  descriptionRu: '',
  extraInputs: {},
  inStock: true,
  availableOptions: [],
  highlighted: 1,
  original: true,
};

export const initialOptionInputs = {
  optionKey: '',
  optionValue: '',
  optionPrice: '',
  optionPreviousPrice: '',
  optionCoast: '',
  optionQouantity: 1,
  availableOptions: [],
  inStock: true,
  mainImage: '',
  smallImage: '',
  images: [],
};

export const categoriesObj = {
  fragrance: {
    category: 'Fragrance',
    fragrance: {
      category: 'Fragrance',
      brands: [],
      type: ['Men', 'Women', 'Uni'],
    },
    carFresheners: {
      category: 'Car Air Fresheners',
      type: [],
    },
    homeFresheners: {
      category: 'Home Air Fresheners',
      type: [],
    },
    deodorant: {
      category: 'Deodorant',
      type: [],
    },
  },

  makeup: {
    face: {
      category: 'Face',
      type: [
        'Foundation',
        'Highlighter',
        'Face Primer',
        'Powder & Setting Spray',
        'Contour',
        'Blush',
        'Concealer',
        'BB & CC cream',
      ],
    },

    eye: {
      category: 'Eye',
      type: ['Brow Gel', 'Eye Palettes', 'Eyebrow pencil', 'Eyeliner', 'Pencil'],
    },
    lip: {
      category: 'Lip',
      type: ['Lipstick', 'Liquid Lipstick', 'Lip Balm & Treatmentl', 'Lip Gloss', 'Lip Liner', 'Lip Oil'],
    },
    category: 'Makeup',
  },

  skincare: {
    category: 'Skincare',
    cleansers: {
      category: 'Cleansers',
      type: ['Cleansers', 'Exfoliation', 'Face Wash', 'Makeup Removers', 'Toners & Lotions'],
    },
    eyeCare: {
      category: 'Eye Care',
      type: ['Dark Circles', 'Eye Patches', 'Lifting/Anti-age Eye Creams'],
    },
    masks: {
      category: 'Masks',
      type: ['Anti-age', 'Eye Patches', 'Face Masks', 'Hydrating'],
    },
    moisturizers: {
      category: 'Moisturizers',
      type: [
        'Face Serums',
        'Face Creams',
        'Face Oils',
        'Mists',
        'Moisturizers',
        'Night Creams',
        'Anti-Aging',
        'Dark Spots',
        'Lifting',
      ],
    },
  },
  bathBody: {
    category: 'Bath & Body',
    bathShower: {
      category: 'Bath & Shower',
      type: ['Gel', 'Hand Wash & Soap', 'Scrub & Exfoliation', 'Shampoo & Conditione'],
      routTo: 'bath-shower',
    },
    bodyCare: {
      category: 'Body Care',
      type: [
        'Antiperspirants',
        'Body Lotion & Body Oils',
        'Body Moisturizers',
        'Cellulite & Stretch Marks',
        'Hand Cream & Foot Cream',
        'Masks & Special Treatment',
      ],
    },
  },
  hair: {
    category: 'Hair',
    hairStyling: {
      category: 'Hair Styling',
      type: ['Gel', 'Hand Wash & Soap', 'Scrub & Exfoliation', 'Shampoo & Conditione'],
    },
  },
  nail: {
    category: 'Nail',
    nail: {
      category: 'Nail',
      type: ['Cuticle care', 'Nail care', 'Nail color', 'Nail polish removers'],
    },
  },
  accessories: {
    category: 'Accessories',
    accessories: { category: 'Accessories', type: [] },
  },
  collection: {
    category: 'Collection',
    collection: { category: 'Collection', type: ['Fragrance', 'Makeup', 'Skincare'] },
  },
};

export default function AddProductPage() {
  const [requiredFields, setRequiredFields] = useState(false);
  const [requiredOption, setRequiredOption] = useState(false);
  const [height, setHeight] = useState(0);
  const [lastProductId, setLastProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({ brands: [], sizes: [] });
  const [options, setOptions] = useState(() => structuredClone(initialOptionInputs));
  const [inputs, setInputs] = useState(() => structuredClone(initialInputs));
  const [createOptionsWithId, setCreateOptionsWithId] = useState(true);

  const doJob = async () => {
    const brandDocref = doc(db, 'brands', 'makeup');
    const brands = await getDoc(brandDocref);
    const docref = doc(db, 'details', 'makeup');
    await setDoc(docref, { brands: brands.data().makeup }, { merge: true });
  };

  // console.log(adminDetials?.data?.projectDetails?.fragranceBrands);

  const addProduct = async () => {
    // console.log(inputs);
    // console.log(options);
    if (
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

    try {
      setLoading(true);
      function getNextProductId(id) {
        const next = parseInt(id, 10) + 1; // increase by 1
        return next.toString().padStart(6, '0'); // keep 7 digits
      }

      const newId = getNextProductId(lastProductId);

      const storage = getStorage();
      const mainImageStorageRef = ref(storage, `glowyProducts/${newId}/main`);
      const smallImageStorageRef = ref(storage, `glowyProducts/${newId}/small`);

      let smallImage = {};
      let mainImage = {};
      const imageArr = [];

      await Promise.all(
        inputs.images.map(async (img, index) => {
          try {
            const imageStorageRef = ref(storage, `glowyProducts/${newId}/images/${index}`);
            await uploadBytes(imageStorageRef, img.file).then((snapshot) => {
              return getDownloadURL(snapshot.ref).then((url) => {
                imageArr.push({
                  ...inputs.images[index],
                  file: url,
                  id: index,
                  src: `glowyProducts/${newId}/images/${index}`,
                });
              });
            });
          } catch (error) {
            console.log(error);
          }
        })
      );

      await uploadBytes(mainImageStorageRef, inputs.mainImage.file).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then((url) => {
          mainImage = { ...inputs.mainImage, file: url, src: `glowyProducts/${newId}/main` };
        });
      });

      await uploadBytes(smallImageStorageRef, inputs.smallImage.file).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then((url) => {
          smallImage = { ...inputs.smallImage, file: url, src: `glowyProducts/${newId}/small` };
        });
      });

      let initialProduct = structuredClone(inputs);
      initialProduct.optionKey = Object.keys(inputs.extraInputs)[0] || '';
      delete initialProduct.extraInputs;

      initialProduct = {
        ...initialProduct,
        id: newId,
        optionHasId: createOptionsWithId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mainImage: mainImage,
        smallImage: smallImage,
        images: imageArr,
        availableOptions: [],
        // highlighted: options.availableOptions.length || 1,
        fullName: `${initialProduct.brand} - ${initialProduct.model}`,
      };
      if (initialProduct.notes) {
        initialProduct.allNotes = [
          ...initialProduct.notes.top,
          ...initialProduct.notes.base,
          ...initialProduct.notes.middle,
        ];
      }

      if (createOptionsWithId) {
        let allProductids = { [newId]: initialProduct.brand + ' - ' + initialProduct.model };

        let startId = newId;
        let lastProductId = newId;
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
            [option.optionKey]: String(option.optionValue),
            highlighted: -index,
          };
          startId = id;
          if (index === options.availableOptions.length - 1) {
            lastProductId = id;
          }
          return item;
        });

        availableOptionItems.forEach((option, index) => {
          const availabeleIds = availableOptionItems
            .filter((f, i) => i !== index)
            .map((item) => ({ id: item.id, [item.optionKey]: String(item[item.optionKey]) }));

          availableOptionItems[index].availableOptions = [
            ...availabeleIds,
            { id: newId, [initialProduct.optionKey]: String(initialProduct[initialProduct.optionKey]) },
          ];
          initialProduct.availableOptions.push({
            id: option.id,
            [option.optionKey]: String(option[option.optionKey]),
          });
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
                            ...inputs.images[index],
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

        const productRef = doc(db, 'glowyProducts', initialProduct.category, 'items', newId);
        const allProductsRef = doc(db, 'allProducts', newId);
        const detailRef = doc(db, 'details', 'projectDetails');

        await setDoc(productRef, initialProduct);
        await setDoc(allProductsRef, initialProduct);

        await Promise.all(
          availableOptionItems.map(async (item, index) => {
            const productRef = doc(db, 'glowyProducts', item.category, 'items', item.id);
            const allProductsRef = doc(db, 'allProducts', item.id);
            await setDoc(productRef, item);
            await setDoc(allProductsRef, item);
          })
        );

        const needUpdateSize = availableOptionItems
          .filter((item) => !categoryData.sizes.includes(item.size))
          .map((i) => i.size);
        if (!categoryData.sizes.includes(inputs.size)) {
          needUpdateSize.push(inputs.size);
        }
        if (needUpdateSize[0] || !categoryData.brands.includes(inputs.brand)) {
          const docref = doc(db, 'details', inputs.category);

          await updateDoc(docref, {
            sizes: arrayUnion(inputs.size, ...needUpdateSize),
            brands: arrayUnion(inputs.brand),
          });
        }

        const updateData = {};

        Object.entries(allProductids).forEach(([key, value]) => {
          updateData[`allProductsIds.${key}`] = value;
        });
        updateData.lastProductId = lastProductId;

        await updateDoc(detailRef, updateData);

        setLastProductId(lastProductId);
        setCategoryData((prev) => {
          let newBrands = prev.brands;
          let newSizes = prev.sizes;
          if (!prev.brands.includes(inputs.brand)) {
            newBrands = [...prev.brands, inputs.brand];
          }
          if (!prev.sizes.includes(inputs.size)) {
            newSizes = [...prev.sizes, inputs.size, ...needUpdateSize];
          }
          return { ...prev, brands: newBrands, sizes: newSizes };
        });

        setInputs(() => structuredClone({ ...initialInputs, category: inputs.category }));

        setOptions(() => structuredClone(initialOptionInputs));
        setRequiredFields(false);
        setRequiredOption(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setLoading(false);
      } else {
        const availableOptionItems = options.availableOptions.map((option, index) => {
          return {
            price: option.optionPrice,
            previousPrice: option.optionPreviousPrice,
            coast: option.optionCoast,
            qouantity: option.optionQouantity,
            inStock: option.inStock,
            size: inputs.size,
            [option.optionKey]: String(option.optionValue),

            id: index,
          };
        });

        initialProduct.availableOptions = availableOptionItems;

        const productRef = doc(db, 'glowyProducts', initialProduct.category, 'items', newId);
        const allProductsRef = doc(db, 'allProducts', newId);
        const detailRef = doc(db, 'details', 'projectDetails');

        await setDoc(productRef, initialProduct);
        await setDoc(allProductsRef, initialProduct);

        const needUpdateSize = availableOptionItems
          .filter((item) => !categoryData.sizes.includes(item.size))
          .map((i) => i.size);
        if (!categoryData.sizes.includes(inputs.size)) {
          needUpdateSize.push(inputs.size);
        }
        if (needUpdateSize[0] || !categoryData.brands.includes(inputs.brand)) {
          const docref = doc(db, 'details', inputs.category);

          await updateDoc(docref, {
            sizes: arrayUnion(inputs.size, ...needUpdateSize),
            brands: arrayUnion(inputs.brand),
          });
        }

        const newItemIdName = initialProduct.brand + ' - ' + initialProduct.model;

        await updateDoc(detailRef, {
          lastProductId: newId,
          ['allProductsIds.' + newId]: newItemIdName,
        });

        setLastProductId(newId);
        setCategoryData((prev) => {
          let newBrands = prev.brands;
          let newSizes = prev.sizes;
          if (!prev.brands.includes(inputs.brand)) {
            newBrands = [...prev.brands, inputs.brand];
          }
          if (!prev.sizes.includes(inputs.size)) {
            newSizes = [...prev.sizes, inputs.size, ...needUpdateSize];
          }
          return { ...prev, brands: newBrands, sizes: newSizes };
        });

        setInputs(() => structuredClone({ ...initialInputs, category: inputs.category }));

        setOptions(() => structuredClone(initialOptionInputs));
        setRequiredFields(false);
        setRequiredOption(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setLoading(false);
      }

      // const availableOptionItems = options.availableOptions.map(async (option, index) => {
      //   let optionSmallImage;
      //   let optionMainImage;
      //   const optionImageArr = [];

      //   await Promise.all(
      //     option.images.map(async (img, index) => {
      //       try {
      //         const imageStorageRef = ref(storage, `glowyProducts/${newId}/${index}/images/${index}`);
      //         await uploadBytes(imageStorageRef, img.file).then((snapshot) => {
      //           return getDownloadURL(snapshot.ref).then((url) => {
      //             optionImageArr.push({
      //               ...option.images[index],
      //               file: url,
      //               id: index,
      //               src: `glowyProducts/${newId}/${index}/images/${index}`,
      //             });
      //           });
      //         });
      //       } catch (error) {
      //         console.log(error);
      //       }
      //     })
      //   );

      //   try {
      //     if (option.mainImage?.file) {
      //       const mainImageStorageRef = ref(storage, `glowyProducts/${newId}/${index}/main`);

      //       await uploadBytes(mainImageStorageRef, option.mainImage.file).then((snapshot) => {
      //         return getDownloadURL(snapshot.ref).then((url) => {
      //           optionMainImage = {
      //             ...option.mainImage,
      //             file: url,
      //             src: `glowyProducts/${newId}/${index}/main`,
      //           };
      //         });
      //       });
      //     }
      //     if (option.smallImage.file) {
      //       const smallImageStorageRef = ref(storage, `glowyProducts/${newId}/${index}/small`);

      //       await uploadBytes(smallImageStorageRef, option.smallImage.file).then((snapshot) => {
      //         return getDownloadURL(snapshot.ref).then((url) => {
      //           optionSmallImage = {
      //             ...option.smallImage,
      //             file: url,
      //             src: `glowyProducts/${newId}/${index}/small`,
      //           };
      //         });
      //       });
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }

      //   return {
      //     price: option.optionPrice,
      //     previousPrice: option.optionPreviousPrice,
      //     coast: option.optionCoast,
      //     qouantity: option.optionQouantity,
      //     inStock: option.inStock,
      //     size: inputs.size,
      //     [option.optionKey]: option.optionValue == null ? '' : String(option.optionValue),
      //     mainImage: optionMainImage || mainImage,
      //     smallImage: optionSmallImage || smallImage,
      //     images: optionImageArr[0] || imageArr,
      //     id: index,
      //   };
      // });

      // initialProduct.availableOptions = await Promise.all(availableOptionItems);
      // const productRef = doc(db, 'glowyProducts', initialProduct.category, 'items', newId);
      // const allProductsRef = doc(db, 'allProducts', newId);
      // const detailRef = doc(db, 'details', 'projectDetails');

      // const newItemIdName = initialProduct.brand + ' - ' + initialProduct.model;

      // await setDoc(productRef, initialProduct);
      // await setDoc(allProductsRef, initialProduct);
      // await updateDoc(detailRef, {
      //   lastProductId: newId,
      //   ['allProductsIds.' + newId]: newItemIdName,
      // });

      // const needUpdateSize = initialProduct.availableOptions
      //   .filter((item) => !categoryData.sizes.includes(item.size))
      //   .map((i) => i.size);

      // if (!categoryData.sizes.includes(inputs.size) || !categoryData.brands.includes(inputs.brand)) {
      //   const docref = doc(db, 'details', inputs.category);

      //   await updateDoc(docref, {
      //     sizes: arrayUnion(inputs.size, ...needUpdateSize),
      //     brands: arrayUnion(inputs.brand),
      //   });
      // }
      // setLastProductId(newId);
      // setCategoryData((prev) => {
      //   let newBrands = prev.brands;
      //   let newSizes = prev.sizes;
      //   if (!prev.brands.includes(inputs.brand)) {
      //     newBrands = [...prev.brands, inputs.brand];
      //   }
      //   if (!prev.sizes.includes(inputs.size)) {
      //     newSizes = [...prev.sizes, inputs.size, ...needUpdateSize];
      //   }
      //   return { ...prev, brands: newBrands, sizes: newSizes };
      // });

      // setInputs(() => structuredClone({ ...initialInputs, category: inputs.category }));

      // setOptions(() => structuredClone(initialOptionInputs));
      // setRequiredFields(false);
      // setRequiredOption(false);
      // window.scrollTo({ top: 0, behavior: 'smooth' });

      // setLoading(false);
    } catch (e) {
      setInputs(() => structuredClone(initialInputs));
      setOptions(() => structuredClone(initialOptionInputs));
      setLoading(false);
      console.log(e);
    }
  };

  const handleChangeOptions = (e) => {
    if (e.target.type === 'number') {
      setOptions({ ...options, [e.target.name]: Number(e.target.value) });
    } else {
      setOptions({ ...options, [e.target.name]: e.target.value });
    }
  };

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

  const hadleChangeInputs = (e) => {
    if (e.target.name === 'category') {
      setInputs({
        ...structuredClone(initialInputs),
        category: e.target.value,
      });
      setOptions(() => structuredClone(initialOptionInputs));
    } else if (e.target.name === 'subCategory') {
      if (e.target.value === 'fragrance') {
        setInputs({
          ...structuredClone(initialInputs),
          category: inputs.category,
          subCategory: e.target.value,
          notes: { base: [], middle: [], top: [] },
        });
      } else {
        setInputs({
          ...structuredClone(initialInputs),
          category: inputs.category,
          subCategory: e.target.value,
        });
      }
      setOptions(() => structuredClone(initialOptionInputs));
    } else {
      if (e.target.type === 'number' && e.target.name !== 'size') {
        setInputs({ ...inputs, [e.target.name]: Number(e.target.value) });
      } else {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAdminData();
      setLastProductId(data?.projectDetails?.lastProductId);

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (inputs.category) {
      const fetcheCategoryData = async () => {
        const categoryDocref = doc(db, 'details', inputs.category);
        const categoryData = await getDoc(categoryDocref);
        if (categoryData.exists()) {
          setCategoryData({ brands: [], sizes: [], ...categoryData.data() });
        } else {
          setCategoryData({ brands: [], sizes: [] });
        }
      };
      fetcheCategoryData();
    }
  }, [inputs.category]);

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

  if (!lastProductId)
    return (
      <Grid sx={{ position: 'relative', height: '200px' }} container>
        <CircularProgress
          sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      </Grid>
    );

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
      // size={12}
    >
      {loading && (
        <CircularProgress
          sx={{ position: 'fixed', top: '50%', left: 'calc(50% - 20px)', transform: 'translate(-50%, -50%)' }}
        />
      )}
      <Button
        onClick={() => {
          console.log(lastProductId);
          // console.log(categoryData.brands.includes(inputs.brand));
          // console.log(categoryData.sizes.includes(inputs.size));

          // console.log(inputs);
          console.log(options);
          // console.log(initialOptionInputs);
          // doJob();
        }}
      >
        asd
      </Button>
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
        <CategoriesInputs
          inputs={inputs}
          requiredFields={requiredFields}
          hadleChangeInputs={hadleChangeInputs}
          categoriesObj={categoriesObj}
        />

        <InitialProductInputs
          handleChangeNotes={handleChangeNotes}
          notes={categoryData?.perfumeNotes}
          inputs={inputs}
          hadleChangeInputs={hadleChangeInputs}
          suppliers={{}}
          brands={categoryData?.brands || []}
          sizes={categoryData?.sizes || []}
          requiredFields={requiredFields}
        />

        {Object.keys(inputs.extraInputs).length !== 0 && (
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
        <ExtraProductOptions
          requiredOption={requiredOption}
          setRequiredOption={setRequiredOption}
          inputs={inputs}
          setInputs={setInputs}
          options={options}
          setOptions={setOptions}
          handleChangeOptions={handleChangeOptions}
          height={height}
          setLoading={setLoading}
          createId={createOptionsWithId}
          setCreateId={setCreateOptionsWithId}
        />
        <ImageInputs
          requiredFields={requiredFields}
          inputs={inputs}
          setInputs={setInputs}
          height={height}
          setLoading={setLoading}
        />
        <DescriptionInput inputs={inputs} hadleChangeInputs={hadleChangeInputs} />
        <Button
          onClick={addProduct}
          color="success"
          sx={{ textTransform: 'capitalize', mt: '20px' }}
          variant="contained"
        >
          Add Product
        </Button>
      </Grid>
    </Grid>
  );
}
