'use client';
import { CircularProgress } from '@mui/material';
import { createContext, useContext, useState } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ data, children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <AdminContext.Provider value={{ data, loading, setLoading }}>
      {loading && <CircularProgress sx={{ position: 'fixed', top: '50vh', right: '50%' }} />}
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminContext);
