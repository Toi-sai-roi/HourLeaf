import AsyncStorage from '@react-native-async-storage/async-storage';

export const ADMIN_KEYS = {
  FLASH_SALES: 'admin_flash_sales',
  PROMOS: 'admin_promos',
  PRODUCT_TAGS: 'admin_product_tags',
};

export type FlashSale = {
  id: string;
  productId: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  active: boolean;
};

export type AdminPromo = {
  id: string;
  code: string;
  percent: number;
  label: string;
  minOrder: number;
  active: boolean;
};

export type ProductTag = {
  id: string;
  productId: string;
  tag: 'new' | 'hot' | 'sale20' | 'sale30' | 'buy1get1';
  active: boolean;
};

// Flash Sale
export const getFlashSales = async (): Promise<FlashSale[]> => {
  const data = await AsyncStorage.getItem(ADMIN_KEYS.FLASH_SALES);
  return data ? JSON.parse(data) : [];
};

export const saveFlashSale = async (sale: FlashSale) => {
  const sales = await getFlashSales();
  sales.push(sale);
  await AsyncStorage.setItem(ADMIN_KEYS.FLASH_SALES, JSON.stringify(sales));
  console.log('✅ Saved flash sale:', sale);
};

export const updateFlashSale = async (id: string, updates: Partial<FlashSale>) => {
  const sales = await getFlashSales();
  const index = sales.findIndex(s => s.id === id);
  if (index !== -1) {
    sales[index] = { ...sales[index], ...updates };
    await AsyncStorage.setItem(ADMIN_KEYS.FLASH_SALES, JSON.stringify(sales));
    console.log('✅ Updated flash sale:', id);
  }
};

export const deleteFlashSale = async (id: string) => {
  const sales = await getFlashSales();
  const filtered = sales.filter(s => s.id !== id);
  await AsyncStorage.setItem(ADMIN_KEYS.FLASH_SALES, JSON.stringify(filtered));
  console.log('✅ Deleted flash sale:', id);
};

// Promo Codes
export const initDefaultPromos = async () => {
  const existing = await getAdminPromos();
  if (existing.length === 0) {
    const defaultPromos: AdminPromo[] = [
      { id: '1', code: 'DAWN15', percent: 15, label: 'Ưu đãi ban mai', minOrder: 0, active: true },
      { id: '2', code: 'MORNING10', percent: 10, label: 'Sáng khoẻ', minOrder: 0, active: true },
      { id: '3', code: 'NOON20', percent: 20, label: 'Trưa nhanh', minOrder: 15, active: true },
      { id: '4', code: 'AFTERNOON15', percent: 15, label: 'Chiều vui', minOrder: 0, active: true },
      { id: '5', code: 'EVENING25', percent: 25, label: 'Tối rộn ràng', minOrder: 20, active: true },
      { id: '6', code: 'NIGHT30', percent: 30, label: 'Đêm thức', minOrder: 25, active: true },
    ];
    for (const promo of defaultPromos) {
      await saveAdminPromo(promo);
    }
    console.log('✅ Default promos initialized');
  }
};
export const getAdminPromos = async (): Promise<AdminPromo[]> => {
  const data = await AsyncStorage.getItem(ADMIN_KEYS.PROMOS);
  return data ? JSON.parse(data) : [];
};

export const saveAdminPromo = async (promo: AdminPromo) => {
  const promos = await getAdminPromos();
  promos.push(promo);
  await AsyncStorage.setItem(ADMIN_KEYS.PROMOS, JSON.stringify(promos));
  console.log('✅ Saved promo:', promo.code);
};

export const updateAdminPromo = async (id: string, updates: Partial<AdminPromo>) => {
  const promos = await getAdminPromos();
  const index = promos.findIndex(p => p.id === id);
  if (index !== -1) {
    promos[index] = { ...promos[index], ...updates };
    await AsyncStorage.setItem(ADMIN_KEYS.PROMOS, JSON.stringify(promos));
    console.log('✅ Updated promo:', id);
  }
};

export const deleteAdminPromo = async (id: string) => {
  const promos = await getAdminPromos();
  const filtered = promos.filter(p => p.id !== id);
  await AsyncStorage.setItem(ADMIN_KEYS.PROMOS, JSON.stringify(filtered));
  console.log('✅ Deleted promo:', id);
};

// Product Tags
export const getProductTags = async (): Promise<ProductTag[]> => {
  const data = await AsyncStorage.getItem(ADMIN_KEYS.PRODUCT_TAGS);
  return data ? JSON.parse(data) : [];
};

export const saveProductTag = async (tag: ProductTag) => {
  const tags = await getProductTags();
  tags.push(tag);
  await AsyncStorage.setItem(ADMIN_KEYS.PRODUCT_TAGS, JSON.stringify(tags));
  console.log('✅ Saved tag:', tag);
};

export const updateProductTag = async (id: string, updates: Partial<ProductTag>) => {
  const tags = await getProductTags();
  const index = tags.findIndex(t => t.id === id);
  if (index !== -1) {
    tags[index] = { ...tags[index], ...updates };
    await AsyncStorage.setItem(ADMIN_KEYS.PRODUCT_TAGS, JSON.stringify(tags));
    console.log('✅ Updated tag:', id);
  }
};

export const deleteProductTag = async (id: string) => {
  const tags = await getProductTags();
  const filtered = tags.filter(t => t.id !== id);
  await AsyncStorage.setItem(ADMIN_KEYS.PRODUCT_TAGS, JSON.stringify(filtered));
  console.log('✅ Deleted tag:', id);
};