# HourLeaf – Ứng dụng mua sắm thực phẩm trực tuyến

**Lê Văn Tùng - 23810310325**

## Giới thiệu

HourLeaf là ứng dụng di động mua sắm thực phẩm (grocery) với điểm nhấn **giao diện thay đổi theo thời gian thực (mood theo giờ)**.  
Ứng dụng được xây dựng bằng React Native (Expo), sử dụng AsyncStorage để lưu trữ dữ liệu cục bộ, Context API để quản lý state toàn cục.

---

## Danh sách thành viên

| Họ tên | MSSV | Vai trò |
|--------|------|---------|
| Trần Lợi Nhân | 23810310318 | Phân tích, thiết kế, phát triển chính, Admin Panel, báo cáo |
| Lê Văn Tùng | 23810310325 | Phát triển giao diện, logic giỏ hàng, thanh toán, video demo |
| Lê Trung Sơn | 23810310352 | Hỗ trợ Admin Panel, tag, flash sale, kiểm thử, tài liệu |

---

## Tính năng chính

### Người dùng (User)
- 🔐 Đăng nhập, đăng ký, quên mật khẩu
- 🛒 Xem danh sách sản phẩm theo danh mục, tìm kiếm, lọc
- 📱 Xem chi tiết sản phẩm (đánh giá, sản phẩm liên quan, flash sale)
- 🛍️ Thêm vào giỏ hàng, tăng/giảm số lượng, xóa sản phẩm
- 💳 Thanh toán giả lập (COD, MoMo, VNPay, PayPal)
- 📦 Đặt hàng, theo dõi lịch sử đơn hàng (trạng thái realtime)
- ❤️ Yêu thích sản phẩm
- 🔔 Thông báo có CTA, xóa nhiều
- ⭐ Đánh giá sản phẩm, đánh giá ứng dụng
- 📍 Quản lý địa chỉ giao hàng
- 💳 Quản lý phương thức thanh toán

### Quản trị viên (Admin)
- 📊 Dashboard doanh thu (biểu đồ 7 ngày, top sản phẩm bán chạy)
- 🏷️ Quản lý mã giảm giá (CRUD, bật/tắt)
- ⚡ Quản lý flash sale (CRUD, theo khung giờ 17h-20h / 21h-23h)
- 🏷️ Quản lý tag sản phẩm (new, hot, sale20, sale30, buy1get1) – có thể gắn hàng loạt

### Điểm nhấn đặc biệt
- 🌤️ Giao diện thay đổi theo 7 khung giờ: rạng sáng, sáng, trưa, chiều, tối, đêm khuya, khuya khoắt
- 🎭 Chế độ DEMO – cho phép chọn giờ để xem giao diện thay đổi mà không cần chờ thời gian thực
- 🖼️ Ảnh nền động theo từng khung giờ, banner hero riêng biệt
- 📱 Haptic feedback khi thao tác

---

## Công nghệ sử dụng

- React Native (Expo)
- TypeScript
- AsyncStorage
- React Navigation (Stack, Tabs)
- Context API
- Expo LinearGradient
- React Native Chart Kit
- Expo Haptics

---

## Cài đặt và chạy ứng dụng


Tài khoản demo
Email	Mật khẩu	Vai trò
tung@shop.com	tung123	User
binh@shop.com	binh123	User
admin@shop.com	admin123	Admin
Hình ảnh minh họa
![màn chính](assets/index/indexx.png)

Link video demo
▶ Bấm vào đây để xem video demo
Link online đã deploy[Link online đã deploy](https://eclectic-pika-9aa629.netlify.app)


Hướng phát triển
- Tích hợp thanh toán thực tế (VNPay, MoMo, PayPal)
- Kết nối cơ sở dữ liệu trực tuyến (Firebase / backend)
- Thêm tính năng chat hỗ trợ khách hàng, gợi ý sản phẩm bằng AI
- Tích điểm / Hội viên thân thiết
- Cải thiện hiệu năng, phát triển phiên bản iOS riêng biệt

CẤU TRÚC PROJECT:
HourLeaf/
└── my-app/                     # Thư mục gốc của dự án Expo
    │
    ├── app/                    # Chứa toàn bộ màn hình (screens) và điều hướng
    │   ├── (auth)/             # Nhóm màn hình xác thực (đăng nhập, đăng ký, quên mật khẩu)
    │   │   ├── _layout.tsx     # Điều hướng Stack cho auth
    │   │   ├── forgot-password.tsx  # Màn hình quên mật khẩu
    │   │   ├── login.tsx       # Màn hình đăng nhập
    │   │   ├── onboarding.tsx  # Màn hình giới thiệu (carousel)
    │   │   ├── sign-up.tsx     # Màn hình đăng ký
    │   │   └── splash.tsx      # Màn hình chờ khi mở app
    │   │
    │   ├── (tabs)/             # Nhóm màn hình chính (dùng bottom tab navigation)
    │   │   ├── _layout.tsx     # Điều hướng Tab cho các màn chính
    │   │   ├── account.tsx     # Màn hình tài khoản (thông tin, địa chỉ, thanh toán, order stats)
    │   │   ├── cart.tsx        # Màn hình giỏ hàng
    │   │   ├── explore.tsx     # Màn hình khám phá sản phẩm
    │   │   ├── favourites.tsx  # Màn hình yêu thích
    │   │   ├── index.tsx       # Màn hình chính (Home) – có mood theo giờ
    │   │   └── notifications.tsx # Màn hình thông báo (có CTA, xóa nhiều)
    │   │
    │   ├── admin/              # Nhóm màn hình dành cho quản trị viên
    │   │   ├── _layout.tsx     # Điều hướng Stack cho admin
    │   │   ├── flash-sales.tsx # Quản lý flash sale (CRUD, bật/tắt)
    │   │   ├── index.tsx       # Dashboard admin (doanh thu, biểu đồ, top sản phẩm)
    │   │   ├── promos.tsx      # Quản lý mã giảm giá (CRUD, bật/tắt)
    │   │   └── tags.tsx        # Quản lý tag sản phẩm (gắn tag hàng loạt)
    │   │
    │   ├── category/           # Màn hình hiển thị sản phẩm theo danh mục
    │   │   └── [name].tsx      # Màn hình động theo tên danh mục (trái cây, thịt cá...)
    │   │
    │   ├── product/            # Màn hình chi tiết sản phẩm
    │   │   └── [id].tsx        # Màn hình động theo ID sản phẩm (có đánh giá, flash sale, gợi ý)
    │   │
    │   ├── section/            # Màn hình hiển thị sản phẩm theo tag (exclusive, bestselling)
    │   │   └── [tag].tsx       # Màn hình động theo tag
    │   │
    │   ├── _layout.tsx         # Điều hướng tổng thể của toàn app
    │   ├── checkout.tsx        # Màn hình thanh toán (chọn địa chỉ, phương thức, promo)
    │   ├── filters.tsx         # Màn hình lọc sản phẩm (theo danh mục, thương hiệu)
    │   ├── index.tsx           # Màn hình chính (cũ, có thể không dùng)
    │   ├── modal.tsx           # Modal dùng thử (có thể bỏ)
    │   ├── order-failed.tsx    # Màn hình đặt hàng thất bại
    │   ├── order-success.tsx   # Màn hình đặt hàng thành công
    │   ├── orders.tsx          # Màn hình lịch sử đơn hàng (trạng thái realtime)
    │   ├── promo.tsx           # Màn hình xem và áp dụng mã giảm giá
    │   └── search.tsx          # Màn hình tìm kiếm sản phẩm
    │
    ├── assets/                 # Chứa toàn bộ tài nguyên tĩnh (ảnh, icon, video...)
    │   ├── bg/                 # Ảnh nền theo 7 khung giờ
    │   ├── images/             # Ảnh chung (icon, splash...)
    │   ├── index/              # Banner hero theo từng khung giờ
    │   ├── onboarding/         # Ảnh minh hoạ cho màn hình onboarding
    │   └── scr-sh/             # Ảnh chụp màn hình cho báo cáo
    │
    ├── components/             # Các component tái sử dụng
    │   ├── ui/                 # Các component UI nhỏ (collapsible, icon-symbol)
    │   ├── DailyRitualCard.tsx # Card nghi lễ theo giờ (có animation, haptic)
    │   ├── FlashSaleCard.tsx   # Card hiển thị flash sale (theo khung giờ 17h-20h / 21h-23h)
    │   ├── LiveDealBanner.tsx  # Banner flash sale (thay đổi theo giờ)
    │   ├── ProductGrid.tsx     # Grid hiển thị sản phẩm (2 cột)
    │   ├── ProductIcon.tsx     # Component hiển thị icon sản phẩm (ảnh hoặc emoji)
    │   ├── TimeAwareHeader.tsx # Header hiển thị thời gian và câu vibe
    │   ├── VibeController.tsx  # Nút LIVE (chọn giờ demo)
    │   └── VibeOfferCard.tsx   # Card ưu đãi theo giờ (áp dụng mã giảm giá)
    │
    ├── constants/              # Các hằng số và cấu hình
    │   ├── Colors.ts           # Màu sắc chung (Palette, Radius, Spacing)
    │   ├── icon3D.ts           # Mapping icon 3D (nếu dùng)
    │   ├── products.ts         # Danh sách sản phẩm (125+ sản phẩm, có tags)
    │   ├── timeVibeConfig.ts   # Cấu hình mood theo 7 khung giờ
    │   └── vectorIconMap.ts    # Mapping emoji sang icon vector
    │
    ├── context/                # Các Context API quản lý state toàn cục
    │   ├── AdminContext.tsx    # Quản lý dữ liệu admin (promo, flash sale, tag)
    │   ├── CartContext.tsx     # Quản lý giỏ hàng, đơn hàng, xác thực, promo, địa chỉ...
    │   └── TimeDemoContext.tsx # Quản lý chế độ demo (chọn giờ ảo)
    │
    ├── dist/                   # Thư mục export để deploy web (tự sinh)
    │
    ├── hooks/                  # Các custom hook
    │   ├── use-color-scheme.ts # Hook lấy màu sắc hệ thống
    │   ├── use-theme-color.ts  # Hook lấy màu theo theme
    │   ├── useHaptic.ts        # Hook tạo rung (haptic feedback)
    │   ├── useStorage.ts       # Hook lưu trữ dữ liệu AsyncStorage
    │   └── useTimeVibe.ts      # Hook lấy thông tin mood theo giờ thực
    │
    ├── node_modules/           # Thư mục chứa các package (tự sinh)
    │
    ├── scripts/                # Script phụ trợ
    │   └── reset-project.js    # Script reset project (dùng khi cần)
    │
    ├── services/               # Các dịch vụ lưu trữ và xử lý dữ liệu
    │   ├── AdminService.ts     # Lưu trữ dữ liệu admin (promo, flash sale, tag) vào AsyncStorage
    │   └── StorageService.ts   # Lưu trữ dữ liệu user (giỏ hàng, đơn hàng, thông báo, địa chỉ)
    │
    ├── .gitignore              # File bỏ qua khi push lên GitHub
    ├── app.json                # Cấu hình Expo (tên app, icon, splash...)
    ├── eslint.config.js        # Cấu hình ESLint (kiểm tra lỗi code)
    ├── expo-env.d.ts           # Khai báo kiểu cho Expo
    ├── package-lock.json       # File khoá version của các package
    ├── package.json            # Danh sách dependencies và scripts
    └── README.md               # Mô tả dự án (tên, cài đặt, tài khoản demo, link video...)


```bash
git clone https://github.com/Toi-sai-roi/HourLeaf.git
cd my-app
npm install
npx expo start
Quét mã QR bằng Expo Go trên điện thoại hoặc chạy trên web bằng npx expo start --web.