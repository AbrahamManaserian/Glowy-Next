'use client';
import { createContext, useContext } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ data, children }) => (
  <AdminContext.Provider value={data}>{children}</AdminContext.Provider>
);

export const useAdminData = () => useContext(AdminContext);
