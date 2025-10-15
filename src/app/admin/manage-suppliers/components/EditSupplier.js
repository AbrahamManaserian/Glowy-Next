'use client';

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SupplierInputs } from './AddSupplier';
import { db } from '@/firebase';
import { useAdminData } from '../../components/AdminContext';

export default function EditSSupplier() {
  const { suppliers } = useAdminData();
  const data = suppliers;
  const [supplier, setSupplier] = useState('');
  const router = useRouter();
  const [requiredFields, setRequiredFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    setRequiredFields(false);
  }, [inputs]);

  useEffect(() => {
    if (supplier) {
      setInputs({
        id: data[supplier].id,
        name: data[supplier].name,
        address: data[supplier].address,
        phone: data[supplier].phone,
      });
    } else {
      setInputs({
        name: '',
        address: '',
        phone: '',
      });
    }
  }, [supplier]);

  const handleChangeSelect = (e) => {
    setSupplier(e.target.value);
  };

  const deletSupplier = async () => {
    if (!supplier) return;
    try {
      setLoading(true);
      delete data[supplier];
      setSupplier('');
      const docRef = doc(db, 'details', 'suppliers');

      await updateDoc(docRef, {
        suppliers: data,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const editSupplier = async () => {
    if (!inputs.name || !inputs.phone) {
      setRequiredFields(true);
      return;
    }
    try {
      setLoading(true);
      const docRef = doc(db, 'details', 'suppliers');

      await updateDoc(docRef, {
        [`suppliers.${supplier}`]: { ...data[supplier], ...inputs, updatedAt: Date.now() },
      });
      router.refresh();
      setSupplier('');
      setLoading(false);
    } catch (e) {
      setLoading(true);
      console.log(e);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '200px' } }}>
      {loading && <CircularProgress sx={{ position: 'fixed', top: '50vh', right: '50%' }} />}
      <Typography mb={'10px'}>Edit Supplier </Typography>
      <FormControl
        sx={{
          boxSizing: 'border-box',
          width: '100%',
          //   mb: '15px',
        }}
        size="small"
      >
        <InputLabel>Select Suplier</InputLabel>
        <Select value={supplier} label="Select Suplier" onChange={handleChangeSelect}>
          {Object.keys(data).map((key, index) => {
            return (
              <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={key}>
                {data[key].name || 'No name'}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{requiredFields && !supplier ? 'Required' : ' '}</FormHelperText>
      </FormControl>
      <Typography color="textSecondary" ml={'10px'} fontSize={'12px'}>
        Created
      </Typography>
      <Typography fontSize={'14px'} borderBottom={'solid 1px #bdbdbd'} mb={'15px'} pl={'10px'}>
        {data[supplier]?.createdAt ? new Date(data[supplier].createdAt).toLocaleString() : 'Creation Date'}
      </Typography>
      <Typography color="textSecondary" ml={'10px'} fontSize={'12px'}>
        Updated
      </Typography>
      <Typography fontSize={'14px'} borderBottom={'solid 1px #bdbdbd'} mb={'15px'} pl={'10px'}>
        {data[supplier]?.updatedAt ? new Date(data[supplier].updatedAt).toLocaleString() : 'Updated Date'}
      </Typography>
      <Typography color="textSecondary" ml={'10px'} fontSize={'12px'}>
        Supplier Id
      </Typography>
      <Typography borderBottom={'solid 1px #bdbdbd'} mb={'15px'} pl={'10px'}>
        {data[supplier]?.id}
      </Typography>

      <SupplierInputs
        inputs={inputs}
        setInputs={setInputs}
        requiredFields={requiredFields}
        setRequiredFields={setRequiredFields}
      />
      <Button onClick={editSupplier} color="success" sx={{ textTransform: 'capitalize' }} variant="contained">
        Edit Supplier
      </Button>
      <Button
        onClick={deletSupplier}
        color="error"
        sx={{ textTransform: 'capitalize', mt: '15px' }}
        variant="contained"
      >
        Delete Supplier
      </Button>
    </Box>
  );
}
