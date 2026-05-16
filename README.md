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
![màn hình chính](assets/index/indexx.png)

Link video demo
▶ Xem video demo trên Google Drive [video](https://drive.google.com/drive/folders/1rjTvYiUCcpjOWXUqauatIh6e9ZZM8jma?usp=sharing)

Link online đã deploy
🌐 HourLeaf trên Netlify [deploy](https://eclectic-pika-9aa629.netlify.app)

Hướng phát triển
Tích hợp thanh toán thực tế (VNPay, MoMo, PayPal)

Kết nối cơ sở dữ liệu trực tuyến (Firebase / backend)

Thêm tính năng chat hỗ trợ khách hàng, gợi ý sản phẩm bằng AI

Tích điểm / Hội viên thân thiết

Cải thiện hiệu năng, phát triển phiên bản iOS riêng biệt

```bash
git clone https://github.com/Toi-sai-roi/HourLeaf.git
cd my-app
npm install
npx expo start
Quét mã QR bằng Expo Go trên điện thoại hoặc chạy trên web bằng npx expo start --web.