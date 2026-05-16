// app/(tabs)/account.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from "react-native";
import { useCart, getOrderStatus } from "../../context/CartContext";
import { logoutUser } from '../../services/StorageService';
import { useTimeVibe } from "../../hooks/useTimeVibe";
import { Radius, Spacing } from "../../constants/Colors";
import { useHaptic } from '../../hooks/useHaptic';

const MENU_ACCOUNT = [
  { label: "Địa chỉ giao hàng", icon: "location-outline", route: null, color: "#10B981" },
  { label: "Phương thức thanh toán", icon: "card-outline", route: null, color: "#F59E0B" },
  { label: "Mã giảm giá", icon: "pricetag-outline", route: "/promo", color: "#EF4444" },
];

const MENU_SUPPORT = [
  { label: "Yêu thích", icon: "heart-outline", route: "/favourites", color: "#EC4899" },
  { label: "Đánh giá ứng dụng", icon: "star-outline", route: null, color: "#8B5CF6" },
  { label: "Trợ giúp", icon: "help-circle-outline", route: null, color: "#6B7280" },
  { label: "Giới thiệu", icon: "information-circle-outline", route: null, color: "#6B7280" },
];

const PAYMENT_METHODS = [
  { id: 'momo', label: 'MoMo', icon: '💜', color: '#A50064', desc: 'Ví MoMo' },
  { id: 'vnpay', label: 'VNPay', icon: '💙', color: '#0066B3', desc: 'QR & ATM' },
  { id: 'paypal', label: 'PayPal', icon: '🏦', color: '#003087', desc: 'PayPal account' },
  { id: 'cash', label: 'Tiền mặt', icon: '💵', color: '#10B981', desc: 'Thanh toán khi nhận' },
];
export default function AccountScreen() {
  const router = useRouter();
  const { lightImpact, mediumImpact } = useHaptic();
  const { role, allOrders, clearUserData, currentEmail, addresses, addAddress, removeAddress, selectedAddress, selectAddress } = useCart();
  const { vibe } = useTimeVibe();
  const pageAnim = useRef(new Animated.Value(0)).current;
  // const refreshTrigger = useRealtimeStatus(1000);

  const [showRate, setShowRate] = useState(false);
  const [rateStars, setRateStars] = useState(0);
  const [rateDone, setRateDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [showAddress, setShowAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { orders } = useCart();
  const [orderStats, setOrderStats] = useState({ pending: 0, shipping: 0, delivered: 0, review: 0 });

  const ORDER_STATS = [
    { id: "pending", label: "Chờ xác nhận", icon: "time-outline", color: "#F59E0B", count: orderStats.pending },
    { id: "shipping", label: "Đang giao", icon: "bicycle-outline", color: "#3B82F6", count: orderStats.shipping },
    { id: "delivered", label: "Đã giao", icon: "checkmark-circle-outline", color: "#10B981", count: orderStats.delivered },
  ];
  const FAQS = [
    { q: "Làm sao để đặt hàng?", a: "Thêm sản phẩm vào giỏ, vào Cart rồi nhấn Checkout để đặt hàng." },
    { q: "Tôi có thể huỷ đơn không?", a: "Hiện tại app chưa hỗ trợ huỷ đơn sau khi đã đặt." },
    { q: "Thanh toán hỗ trợ những hình thức nào?", a: "App hỗ trợ thanh toán bằng thẻ (Card) hoặc tiền mặt (Cash) khi nhận hàng." },
    { q: "Dữ liệu của tôi có được bảo mật không?", a: "Dữ liệu lưu cục bộ trên thiết bị, không gửi lên server." },
  ];

  // Hàm tính toán stats
  useEffect(() => {
    const calculateOrderStats = () => {
      const stats = { pending: 0, shipping: 0, delivered: 0, review: 0 };
      orders.forEach(order => {
        if (order.status === "Thất bại") return;
        const currentStatus = getOrderStatus(order.date);
        if (currentStatus === "Chờ xác nhận") stats.pending++;
        else if (currentStatus === "Đang giao") stats.shipping++;
        else if (currentStatus === "Đã giao") stats.delivered++;
      });
      setOrderStats(stats);
    };

    calculateOrderStats();
    const interval = setInterval(calculateOrderStats, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    Animated.timing(pageAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [pageAnim]);

  useEffect(() => {
    if (!currentEmail) return;
    (async () => {
      const n = await AsyncStorage.getItem(`profile_name_${currentEmail}`);
      const e = await AsyncStorage.getItem(`profile_email_${currentEmail}`);
      setName(n || currentEmail.split('@')[0]);
      setEmail(e || currentEmail);
    })();
  }, [currentEmail]);

  const openEdit = () => {
    setDraftName(name);
    setDraftEmail(email);
    setShowEdit(true);
  };

  const saveEdit = async () => {
    const newName = draftName.trim() || name;
    const newEmail = draftEmail.trim() || email;
    setName(newName);
    setEmail(newEmail);
    await AsyncStorage.setItem(`profile_name_${currentEmail}`, newName);
    await AsyncStorage.setItem(`profile_email_${currentEmail}`, newEmail);
    setShowEdit(false);
  };

  const handleAddAddress = () => {
    if (!newLabel.trim() || !newDetail.trim()) return;
    addAddress({ label: newLabel.trim(), detail: newDetail.trim() });
    setNewLabel('');
    setNewDetail('');
  };

  // Giả lập số dư ví (lấy từ local storage sau)
  const walletBalance = 125000;
  const loyaltyPoints = 2450;
  const totalSaved = allOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
  return (
    <Animated.ScrollView
      style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: pageAnim }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Profile Card with Wallet */}
      <View style={[s.profileCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
        <View style={s.profileHeader}>
          <View style={[s.avatarPlaceholder, { backgroundColor: vibe.accentColor }]}>
            <Text style={s.avatarText}>{name.charAt(0).toUpperCase() || "U"}</Text>
          </View>
          <View style={s.profileInfo}>
            <View style={s.nameRow}>
              <Text style={[s.name, { color: vibe.textColor }]}>{name || "Người dùng"}</Text>
              <TouchableOpacity onPress={openEdit}>
                <Ionicons name="pencil-outline" size={16} color={vibe.accentColor} />
              </TouchableOpacity>
            </View>
            <Text style={[s.email, { color: vibe.textColor === '#1a1a1a' ? '#666' : '#aaa' }]}>{email || currentEmail}</Text>
            {role === "admin" && (
              <View style={[s.adminBadge, { backgroundColor: vibe.accentColor + '20' }]}>
                <Text style={[s.adminText, { color: vibe.accentColor }]}>Quản trị viên</Text>
              </View>
            )}
          </View>
        </View>

        {/* Wallet Cards */}
        <View style={s.walletRow}>
          <View style={[s.walletCard, { backgroundColor: vibe.accentColor + '15', borderColor: vibe.accentColor + '30' }]}>
            <Ionicons name="wallet-outline" size={20} color={vibe.accentColor} />
            <View>
              <Text style={[s.walletLabel, { color: vibe.textColor === '#1a1a1a' ? '#666' : '#aaa' }]}>Số dư ví</Text>
              <Text style={[s.walletValue, { color: vibe.accentColor }]}>{walletBalance.toLocaleString()}đ</Text>
            </View>
          </View>
          <View style={[s.walletCard, { backgroundColor: vibe.accentColor + '15', borderColor: vibe.accentColor + '30' }]}>
            <Ionicons name="diamond-outline" size={20} color={vibe.accentColor} />
            <View>
              <Text style={[s.walletLabel, { color: vibe.textColor === '#1a1a1a' ? '#666' : '#aaa' }]}>Điểm tích lũy</Text>
              <Text style={[s.walletValue, { color: vibe.accentColor }]}>{loyaltyPoints}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Order Stats - 4 icons */}
      <View style={[s.orderStatsCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={[s.orderStatsTitle, { color: vibe.textColor }]}>Đơn hàng của tôi</Text>
          <Text style={[s.savedText, { color: vibe.accentColor }]}>💰 Tiết kiệm: ${totalSaved.toFixed(2)}</Text>
        </View>
        <View style={s.orderStatsRow}>
          {ORDER_STATS.map((stat) => (
            <TouchableOpacity
              key={stat.id}
              style={s.orderStatItem}
              onPress={() => {
                lightImpact();
                if (stat.id === 'pending') router.push('/orders');
                else if (stat.id === 'shipping') router.push('/orders');
                else if (stat.id === 'delivered') router.push('/orders');
                else if (stat.id === 'review') router.push('/orders');
              }}
            >
              <View style={[s.orderStatIconWrap, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                {stat.count > 0 && (
                  <View style={[s.orderStatBadge, { backgroundColor: vibe.accentColor }]}>
                    <Text style={s.orderStatBadgeText}>{stat.count > 99 ? "99+" : stat.count}</Text>
                  </View>
                )}
              </View>
              <Text style={[s.orderStatLabel, { color: vibe.textColor === '#1a1a1a' ? '#666' : '#aaa' }]}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Admin Panel - NỔI BẬT */}
      {role === "admin" && (
        <View style={[s.adminPanelSection, { backgroundColor: vibe.accentColor + '10', borderColor: vibe.accentColor, borderWidth: 1, borderRadius: Radius.lg, marginBottom: 20 }]}>
          <TouchableOpacity
            style={s.adminPanelHeader}
            onPress={() => router.push('../admin')}
          >
            <View style={s.adminPanelLeft}>
              <View style={[s.adminIconWrap, { backgroundColor: vibe.accentColor + '30' }]}>
                <Ionicons name="shield-checkmark-outline" size={24} color={vibe.accentColor} />
              </View>
              <Text style={[s.adminPanelTitle, { color: vibe.textColor }]}>Admin Panel</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={vibe.accentColor} />
          </TouchableOpacity>
          <Text style={[s.adminPanelDesc, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
            Quản lý mã giảm giá, flash sale, tag sản phẩm
          </Text>
        </View>
      )}

      {/* Menu Tài khoản */}
      <Text style={[s.menuSectionTitle, { color: vibe.textColor }]}>Tiện ích</Text>
      {MENU_ACCOUNT.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[s.menuItem, { borderColor: vibe.borderColor }]}
          onPress={() => {
            lightImpact();
            if (item.label === "Địa chỉ giao hàng") setShowAddress(true);
            else if (item.label === "Phương thức thanh toán") setShowPayment(true);
            else if (item.route) router.push(item.route as any);
          }}
        >
          <View style={[s.menuIconWrap, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon as any} size={18} color={item.color} />
          </View>
          <Text style={[s.menuLabel, { color: vibe.textColor }]}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>
      ))}

      {/* Menu Hỗ trợ */}
      <Text style={[s.menuSectionTitle, { color: vibe.textColor }]}>Hỗ trợ</Text>
      {MENU_SUPPORT.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[s.menuItem, { borderColor: vibe.borderColor }]}
          onPress={() => {
            lightImpact();
            if (item.label === "Đánh giá ứng dụng") setShowRate(true);
            else if (item.label === "Trợ giúp") setShowHelp(true);
            else if (item.label === "Giới thiệu") setShowAbout(true);
            else if (item.route) router.push(item.route as any);
          }}
        >
          <View style={[s.menuIconWrap, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon as any} size={18} color={item.color} />
          </View>
          <Text style={[s.menuLabel, { color: vibe.textColor }]}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>
      ))}

      {/* Logout Button */}
      <TouchableOpacity
        style={[s.logoutBtn, { borderColor: vibe.borderColor }]}
        onPress={async () => {
          mediumImpact();
          clearUserData();
          await logoutUser();
          router.replace("/(auth)/login");
        }}
      >
        <Ionicons name="log-out-outline" size={20} color="#f44336" />
        <Text style={s.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      {/* ===== MODALS (giữ nguyên từ file cũ) ===== */}
      {/* Edit Profile Modal */}
      <Modal visible={showEdit} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={[s.modal, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
            <Text style={[s.modalTitle, { color: vibe.textColor }]}>Chỉnh sửa hồ sơ</Text>
            <Text style={[s.fieldLabel, { color: vibe.textColor }]}>Tên</Text>
            <TextInput style={[s.fieldInput, { backgroundColor: vibe.backgroundColor, borderColor: vibe.borderColor, color: vibe.textColor }]} value={draftName} onChangeText={setDraftName} placeholder="Tên của bạn" placeholderTextColor="#888" />
            <Text style={[s.fieldLabel, { color: vibe.textColor }]}>Email</Text>
            <TextInput style={[s.fieldInput, { backgroundColor: vibe.backgroundColor, borderColor: vibe.borderColor, color: vibe.textColor }]} value={draftEmail} onChangeText={setDraftEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#888" />
            <View style={s.modalBtns}>
              <TouchableOpacity style={[s.cancelBtn, { borderColor: vibe.borderColor }]} onPress={() => setShowEdit(false)}>
                <Text style={[s.cancelText, { color: vibe.textColor }]}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.saveBtn, { backgroundColor: vibe.accentColor }]} onPress={saveEdit}>
                <Text style={s.saveText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Address Modal */}
      <Modal visible={showAddress} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={[s.modal, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, width: '95%', maxHeight: '80%' }]}>
            <Text style={[s.modalTitle, { color: vibe.textColor }]}>📍 Địa chỉ giao hàng</Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {addresses.length === 0 && (
                <Text style={{ color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', fontSize: 13, marginBottom: 8, textAlign: 'center' }}>
                  Chưa có địa chỉ nào
                </Text>
              )}

              {addresses.map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={[
                    s.addressCard,
                    {
                      borderColor: selectedAddress?.id === a.id ? vibe.accentColor : vibe.borderColor,
                      backgroundColor: selectedAddress?.id === a.id ? vibe.accentColor + '15' : vibe.backgroundColor,
                    }
                  ]}
                  onPress={() => selectAddress(a)}
                >
                  <View style={s.addressIconWrap}>
                    <Text style={s.addressIcon}>{a.label === 'Nhà' ? '🏠' : a.label === 'Công ty' ? '🏢' : '📍'}</Text>
                  </View>
                  <View style={s.addressContent}>
                    <Text style={[s.addressLabel, { color: vibe.textColor }]}>{a.label}</Text>
                    <Text style={[s.addressDetail, { color: vibe.textColor === '#1a1a1a' ? '#666' : '#aaa' }]}>{a.detail}</Text>
                  </View>
                  {selectedAddress?.id === a.id && (
                    <Ionicons name="checkmark-circle" size={20} color={vibe.accentColor} />
                  )}
                  <TouchableOpacity onPress={() => removeAddress(a.id)} style={s.addressDelete}>
                    <Ionicons name="trash-outline" size={18} color="#f44336" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[s.fieldLabel, { color: vibe.textColor, marginTop: 12 }]}>Thêm địa chỉ mới</Text>
            <TextInput
              style={[s.fieldInput, { backgroundColor: vibe.backgroundColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
              placeholder='Tên (vd: Nhà, Công ty)'
              placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
              value={newLabel}
              onChangeText={setNewLabel}
            />
            <TextInput
              style={[s.fieldInput, { backgroundColor: vibe.backgroundColor, borderColor: vibe.borderColor, color: vibe.textColor, marginTop: 8 }]}
              placeholder='Địa chỉ chi tiết'
              placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
              value={newDetail}
              onChangeText={setNewDetail}
            />

            <View style={s.modalBtns}>
              <TouchableOpacity style={[s.cancelBtn, { borderColor: vibe.borderColor }]} onPress={() => setShowAddress(false)}>
                <Text style={[s.cancelText, { color: vibe.textColor }]}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.saveBtn, { backgroundColor: vibe.accentColor }]} onPress={handleAddAddress}>
                <Text style={s.saveText}>+ Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={showPayment} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={[s.modal, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, width: '95%' }]}>
            <Text style={[s.modalTitle, { color: vibe.textColor }]}>💳 Phương thức thanh toán</Text>

            {PAYMENT_METHODS.map((method, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  s.paymentCard,
                  { borderColor: selectedMethod?.id === method.id ? vibe.accentColor : vibe.borderColor }
                ]}
                onPress={() => setSelectedPaymentMethod(method)}
              >
                <View style={s.paymentIconWrap}>
                  <Text style={s.paymentIcon}>{method.icon}</Text>
                </View>
                <View style={s.paymentContent}>
                  <Text style={[s.paymentLabel, { color: vibe.textColor }]}>{method.label}</Text>
                  <Text style={[s.paymentDetail, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>{method.desc}</Text>
                </View>
                {selectedMethod?.id === method.id && (
                  <Ionicons name="checkmark-circle" size={20} color={vibe.accentColor} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={[s.closeBtn, { backgroundColor: vibe.accentColor }]} onPress={() => setShowPayment(false)}>
              <Text style={s.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal visible={showHelp} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={[s.modal, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, width: '95%', maxHeight: '80%' }]}>
            <Text style={[s.modalTitle, { color: vibe.textColor }]}>Trợ giúp & Câu hỏi</Text>
            <ScrollView>
              {FAQS.map((faq, i) => (
                <TouchableOpacity
                  key={i}
                  style={{ borderBottomWidth: 1, borderColor: vibe.borderColor, paddingVertical: 12 }}
                  onPress={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontWeight: '600', color: vibe.textColor, fontSize: 14 }}>{faq.q}</Text>
                    <Ionicons name={openFaq === i ? "chevron-up" : "chevron-down"} size={16} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} />
                  </View>
                  {openFaq === i && (
                    <Text style={{ fontSize: 13, color: vibe.textColor === '#1a1a1a' ? '#666' : '#aaa', marginTop: 8, lineHeight: 20 }}>{faq.a}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[s.closeBtn, { backgroundColor: vibe.accentColor }]} onPress={() => setShowHelp(false)}>
              <Text style={s.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={showAbout} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={[s.modal, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
            <Text style={{ fontSize: 48, textAlign: 'center' }}>🛒</Text>
            <Text style={[s.modalTitle, { textAlign: 'center', color: vibe.textColor }]}>HourLeaf</Text>
            <Text style={{ fontSize: 13, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', textAlign: 'center', marginBottom: 4 }}>Phiên bản 2.1.0</Text>
            <Text style={{ fontSize: 13, color: vibe.textColor === '#1a1a1a' ? '#555' : '#aaa', textAlign: 'center', lineHeight: 20, marginBottom: 8 }}>
              Ứng dụng mua sắm tạp hoá trực tuyến, giao hàng nhanh trong vòng 1 giờ.
            </Text>
            <Text style={{ fontSize: 12, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', textAlign: 'center' }}>
              Được phát triển bởi sinh viên{"\n"}Môn Lập trình Di động
            </Text>
            <TouchableOpacity style={[s.closeBtn, { backgroundColor: vibe.accentColor }]} onPress={() => setShowAbout(false)}>
              <Text style={s.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rate Us Modal */}
      <Modal visible={showRate} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={[s.modal, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
            {!rateDone ? (
              <>
                {/* Title + message theo số sao */}
                <Text style={[s.modalTitle, { textAlign: "center", color: vibe.textColor }]}>
                  {rateStars === 0 && "✨ Đánh giá ứng dụng"}
                  {rateStars === 1 && "😢 Ôi không..."}
                  {rateStars === 2 && "🙁 Chưa được lắm..."}
                  {rateStars === 3 && "😐 Cũng tạm được"}
                  {rateStars === 4 && "😊 Tuyệt vời!"}
                  {rateStars === 5 && "🥳 Yêu thích! Cảm ơn bạn!"}
                </Text>

                <Text style={{ fontSize: 13, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', marginBottom: 16, textAlign: "center" }}>
                  {rateStars === 0 && "Bạn thích ứng dụng? Đánh giá để ủng hộ nhé!"}
                  {rateStars === 1 && "Rất tiếc vì trải nghiệm không tốt. Hãy cho chúng tôi biết vấn đề!"}
                  {rateStars === 2 && "Ứng dụng còn nhiều điểm cần cải thiện. Cảm ơn góp ý của bạn!"}
                  {rateStars === 3 && "Cảm ơn bạn! Chúng tôi sẽ cố gắng hơn nữa!"}
                  {rateStars === 4 && "Cảm ơn bạn rất nhiều! Thật vui vì bạn thích ứng dụng!"}
                  {rateStars === 5 && "Bạn là số 1! ❤️ Cảm ơn vì tình cảm đặc biệt dành cho chúng tôi!"}
                </Text>

                {/* Animation cho 5 sao */}
                <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 20 }}>
                  {[1, 2, 3, 4, 5].map((i) => {
                    const isActive = i <= rateStars;
                    return (
                      <TouchableOpacity key={i} onPress={() => setRateStars(i)}>
                        <Animated.View style={{
                          transform: [{
                            scale: isActive && rateStars === i ? 1.2 : 1
                          }]
                        }}>
                          <Ionicons
                            name={isActive ? "star" : "star-outline"}
                            size={36}
                            color={isActive ? "#FFC107" : "#ddd"}
                          />
                        </Animated.View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Hiệu ứng đặc biệt cho 5 sao */}
                {rateStars === 5 && (
                  <View style={{ alignItems: "center", marginBottom: 10 }}>
                    <Text style={{ fontSize: 24, marginBottom: 4 }}>🎉🎊🎉</Text>
                    <Text style={{ fontSize: 12, color: "#FFC107", fontWeight: "700" }}>
                      BẠN LÀ KHÁCH HÀNG TUYỆT VỜI!
                    </Text>
                  </View>
                )}

                <View style={s.modalBtns}>
                  <TouchableOpacity style={[s.cancelBtn, { borderColor: vibe.borderColor }]} onPress={() => setShowRate(false)}>
                    <Text style={[s.cancelText, { color: vibe.textColor }]}>Để sau</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.saveBtn, { backgroundColor: vibe.accentColor, opacity: rateStars === 0 ? 0.5 : 1 }]}
                    disabled={rateStars === 0}
                    onPress={() => setRateDone(true)}
                  >
                    <Text style={s.saveText}>Gửi</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>
                  {rateStars === 5 ? "🎉🎊🎉" : rateStars >= 4 ? "🎉" : "🙏"}
                </Text>
                <Text style={[s.modalTitle, { textAlign: "center", color: vibe.textColor }]}>
                  {rateStars === 5 && "Cảm ơn bạn từ tận đáy lòng! ❤️"}
                  {rateStars === 4 && "Cảm ơn bạn! Chúng tôi sẽ cập nhật thêm tính năng mới!"}
                  {rateStars === 3 && "Cảm ơn góp ý của bạn! Chúng tôi sẽ cải thiện!"}
                  {rateStars <= 2 && "Rất tiếc vì trải nghiệm không tốt. Hãy liên hệ hỗ trợ nhé!"}
                </Text>
                <Text style={{ fontSize: 13, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', textAlign: "center", marginBottom: 20 }}>
                  {rateStars === 5 && "Đánh giá của bạn là món quà tinh thần lớn nhất với chúng tôi!"}
                  {rateStars === 4 && "Chúng tôi sẽ cố gắng hoàn thiện để xứng đáng 5 sao!"}
                  {rateStars === 3 && "Hãy theo dõi bản cập nhật sắp tới nhé!"}
                  {rateStars <= 2 && "Chúng tôi rất muốn nghe ý kiến đóng góp của bạn."}
                </Text>
                <TouchableOpacity style={[s.closeBtn, { backgroundColor: vibe.accentColor }]} onPress={() => { setShowRate(false); setRateDone(false); setRateStars(0); }}>
                  <Text style={s.closeText}>Đóng</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Animated.ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 52 },

  profileCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "700" },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  name: { fontSize: 18, fontWeight: "700" },
  email: { fontSize: 12, marginBottom: 4 },
  adminBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  adminText: { fontSize: 10, fontWeight: '600' },

  walletRow: { flexDirection: 'row', gap: 12 },
  walletCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: Radius.md, borderWidth: 1, padding: 10 },
  walletLabel: { fontSize: 10, marginBottom: 2 },
  walletValue: { fontSize: 14, fontWeight: '700' },

  orderStatsCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: 20 },
  orderStatsTitle: { fontSize: 15, fontWeight: '600', marginBottom: 16 },
  orderStatsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  orderStatItem: { alignItems: 'center', gap: 6 },
  orderStatIconWrap: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  orderStatBadge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  orderStatBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  orderStatLabel: { fontSize: 11 },
  savedText: { fontSize: 12, fontWeight: '600', top: -8 },

  addressCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10, gap: 12 },
  addressIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  addressIcon: { fontSize: 22 },
  addressContent: { flex: 1 },
  addressLabel: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  addressDetail: { fontSize: 12 },
  addressDelete: { padding: 4, marginLeft: 4 },

  paymentCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10, gap: 12 },
  paymentIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  paymentIcon: { fontSize: 22 },
  paymentContent: { flex: 1 },
  paymentLabel: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  paymentDetail: { fontSize: 12 },

  menuSectionTitle: { fontSize: 13, fontWeight: '600', marginBottom: 12, marginTop: 8, opacity: 0.7 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, gap: 14 },
  menuIconWrap: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '500', flex: 1 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderRadius: Radius.md, paddingVertical: 14, marginTop: 24, marginBottom: 40 },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#f44336' },

  statRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: Radius.md, padding: 10, alignItems: 'center', borderWidth: 1 },
  statValue: { fontSize: 16, fontWeight: '700' },
  statLabel: { fontSize: 10, marginTop: 2 },

  emptyText: { fontSize: 13, textAlign: "center", paddingVertical: 8 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { borderRadius: Radius.lg, borderWidth: 1, padding: 24, width: "85%", gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  fieldLabel: { fontSize: 13, marginTop: 8 },
  fieldInput: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, borderWidth: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: "center" },
  cancelText: { fontSize: 15, fontWeight: "600" },
  saveBtn: { flex: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: "center" },
  saveText: { fontSize: 15, color: "#fff", fontWeight: "600" },
  closeBtn: { borderRadius: Radius.md, paddingVertical: 12, alignItems: "center", width: "100%" },
  closeText: { fontSize: 15, color: "#fff", fontWeight: "600" },

  adminSection: { borderRadius: Radius.lg, borderWidth: 1, marginBottom: 20, overflow: 'hidden' },
  adminHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg },
  adminHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  adminHeaderText: { fontSize: 15, fontWeight: '600' },
  revenueContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  adminPanelSection: { padding: Spacing.md, marginBottom: 20 },
  adminPanelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  adminPanelLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  adminIconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  adminPanelTitle: { fontSize: 16, fontWeight: '700' },
  adminPanelDesc: { fontSize: 12, marginTop: 8, marginLeft: 56 },
});
