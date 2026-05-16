import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredUser = {
  username: string;
  email: string;
  role: "admin" | "user";
  password: string;
};

// ===== KEYS =====
export const authKeys = { // Các key để lưu data liên quan đến auth, tách riêng để dễ quản lý và tránh trùng lặp với data của CartContext
  currentUser: "auth_current_user",
  accounts: "auth_accounts",
};

export const dataKeys = (email: string) => ({ // Thêm email vào key để phân biệt data của từng user, tránh trùng lặp khi nhiều người dùng trên cùng thiết bị
  items: `cart_items_${email}`,
  favs: `cart_favs_${email}`,
  orders: `cart_orders_${email}`,
  notifs: `notifs_${email}`,
  reviews: `reviews_${email}`,
  addresses: `addresses_${email}`,
});

// ===== ACCOUNTS CỨNG =====
const HARDCODED: StoredUser[] = [
  { username: "Tung", email: "tung@shop.com", password: "tung123", role: "user" },
  { username: "Binh", email: "binh@shop.com", password: "binh123", role: "user" },
  { username: "Admin", email: "admin@shop.com", password: "admin123", role: "admin" },
];

// ===== LOAD ALL ACCOUNTS =====
export async function loadAccounts(): Promise<StoredUser[]> {
  try {
    const raw = await AsyncStorage.getItem(authKeys.accounts);
    const registered: StoredUser[] = raw ? JSON.parse(raw) : [];
    
    const accountMap = new Map<string, StoredUser>(); // Dùng Map để đảm bảo email là duy nhất, ưu tiên tài khoản registered đè lên HARDCODED nếu trùng
    HARDCODED.forEach(acc => accountMap.set(acc.email.toLowerCase(), acc));
    registered.forEach(acc => accountMap.set(acc.email.toLowerCase(), acc));

    return Array.from(accountMap.values());
  } catch {
    return HARDCODED;
  }
}

// ===== ĐĂNG KÝ =====
export const registerAccount = async (userData: { username: string; email: string; password: string; role: string }) => {
  try {
    const raw = await AsyncStorage.getItem(authKeys.accounts);
    const accounts = raw ? JSON.parse(raw) : [];

    // Kiểm tra email đã tồn tại
    if (accounts.some((acc: any) => acc.email === userData.email)) {
      return { ok: false, msg: "Email đã được đăng ký!" };
    }

    // Tạo tài khoản mới
    const newAccount = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || "user",
    };
    accounts.push(newAccount);
    await AsyncStorage.setItem(authKeys.accounts, JSON.stringify(accounts));

    // ===== THÊM ĐOẠN NÀY: LƯU USER VÀO all_users =====
    const allUsersRaw = await AsyncStorage.getItem('all_users');
    const allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
    allUsers.push({
      id: newAccount.id,
      email: userData.email,
      name: userData.username,
      role: userData.role || "user",
    });
    await AsyncStorage.setItem('all_users', JSON.stringify(allUsers));
    // ===== KẾT THÚC =====

    return { ok: true, msg: "Đăng ký thành công!" };
  } catch (error) {
    console.error("Register error:", error);
    return { ok: false, msg: "Có lỗi xảy ra, thử lại!" };
  }
};

// ===== LOGIN =====
export async function loginAccount(email: string, password: string): Promise<StoredUser | null> { // Hàm này sẽ kiểm tra thông tin đăng nhập với danh sách tài khoản (cứng + đã đăng ký), nếu hợp lệ sẽ lưu thông tin user vào AsyncStorage để duy trì session, trả về thông tin user hoặc null nếu đăng nhập thất bại
  try {
    const all = await loadAccounts();
    const found = all.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!found) return null;
    const expiredAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    await AsyncStorage.setItem(authKeys.currentUser, JSON.stringify({ ...found, expiredAt })); // Lưu thông tin user hiện tại vào AsyncStorage để duy trì session
    return found;
  } catch {
    return null;
  }
}

// ===== LOAD CURRENT USER =====
export async function loadCurrentUser(): Promise<StoredUser | null> {
  try {
    const raw = await AsyncStorage.getItem(authKeys.currentUser);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.expiredAt && Date.now() > data.expiredAt) {
      await AsyncStorage.removeItem(authKeys.currentUser);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// ===== LOGOUT (chỉ xóa session, giữ data) =====
export async function logoutUser(): Promise<void> { // Hàm này sẽ xóa thông tin user hiện tại khỏi AsyncStorage để đăng xuất, không xóa data liên quan đến cart, favs, orders,... để khi đăng nhập lại vẫn giữ nguyên
  try {
    await AsyncStorage.removeItem(authKeys.currentUser);
  } catch (e) {
    console.warn("logoutUser error:", e);
  }
}
// ===== DEFAULT NOTIFS =====
export const DEFAULT_NOTIFS = [
  { id: "1", icon: "🛍️", title: "Chào mừng đến với HourLeaf!", body: "Bắt đầu mua sắm thực phẩm tươi ngon ngay hôm nay.", time: "Vừa xong", read: false, type: 'system' },
  { id: "2", icon: "🎉", title: "Mã giảm giá mới", body: "Dùng mã FRESH10 để được giảm 10% cho đơn hàng.", time: "1 giờ trước", read: false, type: 'system' },
  { id: "3", icon: "🚚", title: "Miễn phí giao hàng hôm nay!", body: "Đơn hàng trên $20 được miễn phí vận chuyển.", time: "3 giờ trước", read: true, type: 'system' },
  { id: "4", icon: "⭐", title: "Đánh giá đơn hàng gần đây", body: "Trải nghiệm của bạn thế nào? Hãy cho chúng tôi biết!", time: "Hôm qua", read: true, type: 'system' },
  { id: "5", icon: "🥦", title: "Hàng mới về", body: "Rau củ hữu cơ tươi mới vừa cập nhật.", time: "2 ngày trước", read: true, type: 'system' },
  { id: "6", icon: "🔥", title: "Flash sale cuối tuần", body: "Giảm đến 50% các mặt hàng chọn lọc. Kết thúc sau 12h!", time: "30 phút trước", read: false, type: 'system' },
  { id: "7", icon: "🎂", title: "Sinh nhật của bạn sắp tới!", body: "Nhận ngay mã giảm 20% cho đơn hàng tiếp theo. Còn 3 ngày!", time: "2 giờ trước", read: false, type: 'system' },
  { id: "8", icon: "🕒", title: "Đơn hàng của bạn đang được giao", body: "#ORD-0427 - Dự kiến giao trong 30 phút tới.", time: "5 giờ trước", read: true, type: 'system' },
  { id: "9", icon: "💎", title: "Mở khoá thành viên VIP", body: "Tích điểm đơn hàng để nhận ưu đãi độc quyền mỗi tháng.", time: "1 ngày trước", read: false, type: 'system' },
  { id: "10", icon: "🌙", title: "Giao hàng xuyên đêm", body: "Đặt từ 22h - 6h sáng, miễn phí ship cho đơn từ $15.", time: "2 ngày trước", read: true, type: 'system' },
];

// ===== LOAD ALL ORDERS (Tối ưu cho Admin) =====
export async function loadAllOrders() {
  try {
    const allAccounts = await loadAccounts();

    const ordersPromises = allAccounts.map(async (acc) => {
      try {
        const raw = await AsyncStorage.getItem(dataKeys(acc.email).orders);
        const userOrders = raw ? JSON.parse(raw) : [];
        return userOrders.map((o: any) => ({ ...o, userEmail: acc.email }));
      } catch {
        return [];
      }
    });

    const results = await Promise.all(ordersPromises);
    return results.flat().sort((a, b) => b.createdAt - a.createdAt); // Sắp xếp đơn mới nhất lên đầu
  } catch (e) {
    console.error("LoadAllOrders Error:", e);
    return [];
  }
}
