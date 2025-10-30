'use client';
import { Backdrop, CircularProgress } from '@mui/material';
import { createContext, useContext, useState } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ data, children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <AdminContext.Provider value={{ data, loading, setLoading }}>
      {/* {loading && ( */}
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* )} */}
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminContext);
