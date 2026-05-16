// context/AdminContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFlashSales, getAdminPromos, getProductTags, FlashSale, AdminPromo, ProductTag } from '../services/AdminService';

interface AdminContextType {
  flashSales: FlashSale[];
  promos: AdminPromo[];
  productTags: ProductTag[];
  refreshData: () => Promise<void>;
  getActiveFlashSales: () => FlashSale[];
  getActivePromos: () => AdminPromo[];
  getProductActiveTags: (productId: string) => ProductTag[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [promos, setPromos] = useState<AdminPromo[]>([]);
  const [productTags, setProductTags] = useState<ProductTag[]>([]);

  const refreshData = async () => {
    const [sales, promoData, tags] = await Promise.all([
      getFlashSales(),
      getAdminPromos(),
      getProductTags(),
    ]);
    setFlashSales(sales);
    setPromos(promoData);
    setProductTags(tags);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getActiveFlashSales = () => {
    const now = new Date().toISOString();
    return flashSales.filter(s => s.active && s.startDate <= now && s.endDate >= now);
  };

  const getActivePromos = () => {
    return promos.filter(p => p.active);
  };

  const getProductActiveTags = (productId: string) => {
    return productTags.filter(t => t.productId === productId && t.active);
  };

  return (
    <AdminContext.Provider
      value={{
        flashSales,
        promos,
        productTags,
        refreshData,
        getActiveFlashSales,
        getActivePromos,
        getProductActiveTags,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};