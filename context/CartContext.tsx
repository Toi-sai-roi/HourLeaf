import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import { dataKeys, DEFAULT_NOTIFS, loadAllOrders } from "../services/StorageService";
import { PRODUCTS_MAP } from "../constants/products";
import { getAdminPromos, AdminPromo } from '../services/AdminService';

/* ================= TYPES ================= */
export type User = {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
};
export type CartItem = {
  id: string; name: string; weight: string; price: number; img: any; icon: string; qty: number;
};
export type FavItem = {
  id: string; name: string; weight: string; price: number; icon: string;
};
export type Order = {
  id: string; date: string; items: CartItem[]; total: number; discount: number;
  status: "Chờ xác nhận" | "Đang giao" | "Đã giao" | "Thất bại"
  address?: Address | null;
};
export const getOrderStatus = (createdAt: string): Order["status"] => {
  const created = new Date(createdAt).getTime();
  const now = new Date().getTime();
  const seconds = Math.floor((now - created) / 1000);

  if (seconds < 30) return "Chờ xác nhận";
  if (seconds < 60) return "Đang giao";
  return "Đã giao";
};

export type Address = {
  id: string; label: string; detail: string;
};
export type FilterState = { cats: string[]; brands: string[] };
export type Notif = {
  id: string; icon: string; title: string; body: string; time: string; read: boolean;
  type?: 'system' | 'interaction' | 'promo';
  cta?: string;
  ctaAction?: string;
};
export type Review = {
  id: string; productId: string; author: string; stars: number; comment: string; date: string;
};
export type Role = "admin" | "user";
export type PromoCode = {
  code: string; percent: number; label: string; minOrder: number;
};

// /* ================= CONSTANTS ================= */
// export const PROMOS: PromoCode[] = [
//   { code: 'FRESH10', percent: 10, label: 'Giảm 10% toàn bộ đơn hàng', minOrder: 0 },
//   { code: 'VEGGIE20', percent: 20, label: 'Giảm 20% cho đơn từ $20', minOrder: 20 },
//   { code: 'NEWUSER30', percent: 30, label: 'Giảm 30% cho đơn đầu tiên', minOrder: 0 },
//   { code: 'BIGBUY15', percent: 15, label: 'Giảm 15% cho đơn từ $50', minOrder: 50 },
//   // New time-based promos
//   { code: 'DAWN15', percent: 15, label: 'Ưu đãi ban mai - Giảm 15%', minOrder: 0 },
//   { code: 'MORNING10', percent: 10, label: 'Sáng khoẻ - Giảm 10%', minOrder: 0 },
//   { code: 'NOON20', percent: 20, label: 'Trưa nhanh - Giảm 20%', minOrder: 15 },
//   { code: 'AFTERNOON15', percent: 15, label: 'Chiều vui - Giảm 15%', minOrder: 0 },
//   { code: 'EVENING25', percent: 25, label: 'Tối rộn ràng - Giảm 25%', minOrder: 20 },
//   { code: 'NIGHT30', percent: 30, label: 'Đêm thức - Giảm 30%', minOrder: 25 },
// ];

/* ================= CONTEXT TYPE ================= */
type CartContextType = {
  items: CartItem[];
  total: number;
  count: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;

  favs: FavItem[];
  toggleFav: (item: FavItem) => void;
  isFav: (id: string) => boolean;

  orders: Order[];
  createOrder: (status: "Thành công" | "Thất bại") => void;

  addresses: Address[];
  addAddress: (a: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  selectedAddress: Address | null;
  selectAddress: (a: Address) => void;

  adminPromos: AdminPromo[];
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  discount: number;
  finalTotal: number;


  notifs: Notif[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setNotifs: React.Dispatch<React.SetStateAction<Notif[]>>;
  allOrders: Order[];
  updateNotifs: (newNotifs: Notif[]) => void;

  filter: FilterState;
  setFilter: (f: FilterState) => void;

  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "date">) => void;
  getReviews: (productId: string) => Review[];

  allUsers: User[];
  role: Role;
  setRole: (r: Role) => void;

  loadUserData: (email: string, userRole?: Role) => Promise<void>;
  clearUserData: () => void;
  currentEmail: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

/* ================= PROVIDER ================= */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<FavItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<FilterState>({ cats: [], brands: [] });
  const [role, setRole] = useState<Role>("user");
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress,
    setSelectedAddress] = useState<Address | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const roleRef = useRef<Role>("user");
  const emailRef = useRef<string | null>(null);
  const [adminPromos, setAdminPromos] = useState<AdminPromo[]>([]);
  const saveTimeout = useRef<any>(null);
  useEffect(() => {
    const loadPromos = async () => {
      const promos = await getAdminPromos();
      setAdminPromos(promos.filter(p => p.active));
    };
    loadPromos();
  }, []);
  /* ===== LOAD DATA THEO EMAIL ===== */
  const loadUserData = async (email: string, userRole?: Role) => {
    try {
      const keys = dataKeys(email);
      const [i, f, o, n, r, a] = await Promise.all([
        AsyncStorage.getItem(keys.items),
        AsyncStorage.getItem(keys.favs),
        AsyncStorage.getItem(keys.orders),
        AsyncStorage.getItem(keys.notifs),
        AsyncStorage.getItem(keys.reviews),
        AsyncStorage.getItem(keys.addresses),
      ]);

      // MAP GIỎ HÀNG: Chỉ lấy ID và Qty từ storage, rồi trộn với data gốc từ constants
      const storedItems = i ? JSON.parse(i) : [];
      const fullItems = storedItems.map((item: any) => {
        const p = PRODUCTS_MAP[item.id];
        return p ? { ...p, qty: item.qty, img: null } : null;
      }).filter(Boolean); // Loại bỏ nếu sản phẩm không còn tồn tại trong constants
      setItems(fullItems);

      // MAP YÊU THÍCH: Tương tự như giỏ hàng
      const storedFavs = f ? JSON.parse(f) : [];
      const fullFavs = storedFavs.map((fav: any) => PRODUCTS_MAP[fav.id]).filter(Boolean);
      setFavs(fullFavs);

      setOrders(o ? JSON.parse(o) : []);
      const parsedNotifs = n ? JSON.parse(n) : [];
      setNotifs(parsedNotifs.length > 0 ? parsedNotifs : [...DEFAULT_NOTIFS]);
      setReviews(r ? JSON.parse(r) : []);
      setCurrentEmail(email);
      emailRef.current = email;
      setAddresses(a ? JSON.parse(a) : []);

      const effectiveRole = userRole ?? roleRef.current;
      roleRef.current = effectiveRole;

      if (effectiveRole === "admin") {
        const all = await loadAllOrders();
        setAllOrders(all);

        // Load tất cả users
        const usersData = await AsyncStorage.getItem('all_users');
        if (usersData) {
          setAllUsers(JSON.parse(usersData));
        }
      }
    } catch {
      console.warn("loadUserData error");
    } finally {
      setLoaded(true);
    }
  };

  /* ===== CLEAR KHI LOGOUT ===== */
  const clearUserData = () => {
    setItems([]);
    setFavs([]);
    setOrders([]);
    setNotifs([]);
    setReviews([]);
    setAllOrders([]);
    setAppliedPromo(null);
    setCurrentEmail(null);
    roleRef.current = "user";
    emailRef.current = null;
    setLoaded(false);
    setAddresses([]);
    setSelectedAddress(null);
  };

  /* ===== SAVE — tách riêng từng key để tránh đơ ===== */
  useEffect(() => {
    if (!loaded || !emailRef.current) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    const email = emailRef.current;
    const keys = dataKeys(email);

    saveTimeout.current = setTimeout(() => {
      const itemsToSave = items.map(item => ({ id: item.id, qty: item.qty }));
      const favsToSave = favs.map(fav => ({ id: fav.id }));

      AsyncStorage.multiSet([
        [keys.items, JSON.stringify(itemsToSave)],
        [keys.favs, JSON.stringify(favsToSave)],
        [keys.orders, JSON.stringify(orders)],
        [keys.notifs, JSON.stringify(notifs)],
        [keys.reviews, JSON.stringify(reviews)],
        [keys.addresses, JSON.stringify(addresses)],
      ]).then(() => {
        if (roleRef.current === "admin") {
          loadAllOrders().then(setAllOrders);
        }
      });
    }, 400);
  }, [items, favs, orders, notifs, reviews, loaded, currentEmail, addresses]);

  /* ===== CALC ===== */
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const unreadCount = notifs.filter(n => !n.read).length;
  const discount = appliedPromo ? Math.min(total * appliedPromo.percent / 100, total) : 0;
  const finalTotal = total - discount;

  /* ===== CART ===== */
  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems(prev => {
      const exist = prev.find(i => i.id === item.id);
      if (exist) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...item, qty }];
    });
  }, []);
  const updateQty = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  };
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => {
    setItems([]);
    if (emailRef.current) {
      AsyncStorage.setItem(dataKeys(emailRef.current).items, JSON.stringify([]));
    }
  };

  /* ===== ORDER ===== */
  const createOrder = (status: "Thành công" | "Thất bại") => {
    if (!items.length) return;

    const newStatus = status === "Thất bại" ? "Thất bại" : "Chờ xác nhận";

    const order: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items,
      discount,
      total: finalTotal,
      status: newStatus,
      address: selectedAddress ?? null,
    };
    setOrders(prev => [order, ...prev]);
    if (status === "Thành công") {
      setItems([]);
      setAppliedPromo(null);
    }
  };

  /* ===== FAV ===== */
  const toggleFav = (item: FavItem) => {
    setFavs(prev =>
      prev.some(f => f.id === item.id)
        ? prev.filter(f => f.id !== item.id)
        : [...prev, item]
    );
  };
  const isFav = (id: string) => favs.some(f => f.id === id);

  /* ===== ADDRESS ===== */
  const addAddress = (a: Omit<Address, 'id'>) => {
    const newAddr = { ...a, id: Date.now().toString() };
    setAddresses(prev => [...prev, newAddr]);
    if (!selectedAddress) setSelectedAddress(newAddr);
  };
  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress?.id === id) setSelectedAddress(null);
  };
  const selectAddress = (a: Address) => setSelectedAddress(a);

  /* ===== PROMO ===== */
  const applyPromo = (code: string): boolean => {
    const promo = adminPromos.find(p => p.code === code.toUpperCase());
    if (!promo || total < promo.minOrder) return false;
    setAppliedPromo(promo);
    return true;
  };
  const removePromo = () => setAppliedPromo(null);

  /* ===== NOTIF ===== */
  const markRead = (id: string) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  const markAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const updateNotifs = (newNotifs: Notif[]) => {
    setNotifs(newNotifs);
  };

  /* ===== REVIEW ===== */
  const addReview = (r: Omit<Review, "id" | "date">) => {
    setReviews(prev => [{
      ...r,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("vi-VN"),
    }, ...prev]);
  };
  const getReviews = (productId: string) =>
    reviews.filter(r => r.productId === productId);

  return (
    <CartContext.Provider
      value={{
        items, total, count,
        addItem, updateQty, removeItem, clearCart,
        favs, toggleFav, isFav,
        orders, createOrder,
        appliedPromo, applyPromo, removePromo, discount, finalTotal, adminPromos,
        notifs, unreadCount, markRead, markAllRead, setNotifs, updateNotifs,
        allOrders,
        allUsers,
        filter, setFilter,
        reviews, addReview, getReviews,
        role, setRole,
        loadUserData, clearUserData, currentEmail,
        addresses, addAddress, removeAddress, selectedAddress, selectAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải được sử dụng trong CartProvider");
  return ctx;
}