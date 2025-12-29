'use client';

import { Button, Grid, TextField, Typography } from '@mui/material';
import ExtraProductOptions from '../_components/ExtraProductOptions';
import { useEffect, useState } from 'react';
import { useAdminData } from '../_components/AdminContext';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import InitialProductInputs from '../_components/InitialProductInputs';
import CategoriesInputs from '../_components/CategoriesInputs';
import DescriptionInput from '../_components/DescriptionInput';
import ImageInputs from '../_components/ImageInputs';

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

const fragranceBrands = [
  'Amouage',
  'Ariana Grande',
  'Armaf',
  'Azzaro',
  'Bvlgari',
  'Burberry',
  'Byredo',
  'Calvin Klein',
  'Carolina Herrera',
  'Chanel',
  'Christian Dior',
  'Clive Christian',
  'Creed',
  'Diptyque',
  'Dolce & Gabbana',
  'Ermenegildo Zegna',
  'Givenchy',
  'Giorgio Armani',
  'Gucci',
  'Guerlain',
  'Hermès',
  'Hugo Boss',
  'Initio Parfums Privés',
  'Issey Miyake',
  'Jean Paul Gaultier',
  'Jo Malone London',
  'Kilian Paris',
  'Lancôme',
  'Le Labo',
  'Maison Francis Kurkdjian',
  'Maison Margiela',
  'Mancera',
  'Mugler',
  'Montale',
  'Montblanc',
  'Narciso Rodriguez',
  'Paco Rabanne',
  'Parfums de Marly',
  'Penhaligon’s',
  'Prada',
  'Roja Parfums',
  'Salvatore Ferragamo',
  'Tiziana Terenzi',
  'Tom Ford',
  'Valentino',
  'Versace',
  'Xerjoff',
  'Yves Saint Laurent',
  'Zara',
];

export const categoriesObj = {
  fragrance: {
    category: 'Fragrance',
    fragrance: {
      category: 'Fragrance',
      brands: fragranceBrands,
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
  const adminDetials = useAdminData();

  const router = useRouter();
  const [options, setOptions] = useState(() => structuredClone(initialOptionInputs));
  const [inputs, setInputs] = useState(() => structuredClone(initialInputs));

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
      adminDetials.setLoading(true);
      function getNextProductId(id) {
        const next = parseInt(id, 10) + 1; // increase by 1
        return next.toString().padStart(6, '0'); // keep 7 digits
      }
      const allProductids = {};
      const newId = getNextProductId(adminDetials.data.projectDetails.lastProductId);

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

      allProductids[newId] = initialProduct.brand + ' - ' + initialProduct.model;

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
          [option.optionKey]: option.optionValue,
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
          .map((item) => ({ id: item.id, [item.optionKey]: item[item.optionKey] }));

        availableOptionItems[index].availableOptions = [
          ...availabeleIds,
          { id: newId, [initialProduct.optionKey]: initialProduct[initialProduct.optionKey] },
        ];
        initialProduct.availableOptions.push({ id: option.id, [option.optionKey]: option[option.optionKey] });
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

      const updateData = {};

      Object.entries(allProductids).forEach(([key, value]) => {
        updateData[`allProductsIds.${key}`] = value;
      });
      updateData.lastProductId = lastProductId;

      await updateDoc(detailRef, updateData);

      adminDetials.setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setInputs(() => structuredClone(initialInputs));

      setOptions(() => structuredClone(initialOptionInputs));
      setRequiredFields(false);
      setRequiredOption(false);
      router.refresh();
    } catch (e) {
      adminDetials.setLoading(false);
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
      if (e.target.type === 'number') {
        setInputs({ ...inputs, [e.target.name]: Number(e.target.value) });
      } else {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
      }
    }
  };

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
      }}
      minHeight={'100vh'}
      alignContent={'flex-start'}
      container
      size={12}
    >
      <Button
        onClick={() => {
          console.log(inputs);
          // console.log(initialOptionInputs);
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
          notes={adminDetials.data.projectDetails.perfumeNotes}
          inputs={inputs}
          hadleChangeInputs={hadleChangeInputs}
          suppliers={adminDetials?.data?.suppliers?.suppliers || {}}
          brands={categoriesObj?.[inputs.category]?.[inputs.subCategory]?.brands || []}
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
          setLoading={adminDetials.setLoading}
        />
        <ImageInputs
          requiredFields={requiredFields}
          inputs={inputs}
          setInputs={setInputs}
          height={height}
          setLoading={adminDetials.setLoading}
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
