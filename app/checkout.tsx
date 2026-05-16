// app/checkout.tsx
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Modal, TextInput, Animated, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useTimeVibe } from '../hooks/useTimeVibe';
import { Spacing, Radius } from '../constants/Colors';
import { getAdminPromos } from '../services/AdminService';

const PAYMENT_METHODS = [
  { id: 'momo', label: 'MoMo', icon: '💜', color: '#A50064', desc: 'Ví MoMo' },
  { id: 'vnpay', label: 'VNPay', icon: '💙', color: '#0066B3', desc: 'QR & ATM' },
  { id: 'paypal', label: 'PayPal', icon: '🏦', color: '#003087', desc: 'PayPal account' },
  { id: 'cash', label: 'Tiền mặt', icon: '💵', color: '#10B981', desc: 'Thanh toán khi nhận' },
];

function PaymentSimulator({ method, amount, onSuccess, onFail, onCancel, vibe }: any) {
  const [phase, setPhase] = useState<'confirm' | 'processing' | 'done'>('confirm');
  const [result, setResult] = useState<'success' | 'fail' | null>(null);
  const doneAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const handleConfirm = () => {
    setPhase('processing');
    setTimeout(() => {
      const ok = Math.random() > 0.2;
      setResult(ok ? 'success' : 'fail');
      setPhase('done');
      Animated.spring(doneAnim, { toValue: 1, useNativeDriver: true, bounciness: 14 }).start();
    }, 4000);
  };

  // const getBorderTopRadius = (vibe: any) => { // 
  //   if (vibe.backgroundColor === '#1A1A2E') return 24;
  //   return 24;
  // };

  if (phase === 'confirm') return (
    <View style={[sSim.wrap, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
      <View style={[sSim.gatewayBar, { backgroundColor: method.color }]}>
        <Text style={sSim.gatewayLabel}>{method.icon} {method.label} Thanh toán</Text>
        <TouchableOpacity onPress={onCancel}><Ionicons name="close" size={20} color="#fff" /></TouchableOpacity>
      </View>
      <View style={sSim.body}>
        <Animated.View style={[sSim.logoCircle, { backgroundColor: method.color + '22', transform: [{ scale: pulseAnim }] }]}>
          <Text style={{ fontSize: 48 }}>{method.icon}</Text>
        </Animated.View>
        <Text style={[sSim.merchantName, { color: vibe.textColor }]}>HourLeaf</Text>
        <Text style={[sSim.amountLabel, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Số tiền thanh toán</Text>
        <Text style={[sSim.amountValue, { color: method.color }]}>${amount.toFixed(2)}</Text>
        {method.id !== 'cash' && (
          <View style={[sSim.infoBox, { backgroundColor: vibe.borderColor + '30', borderColor: vibe.borderColor }]}>
            <Text style={[sSim.infoText, { color: vibe.textColor === '#1a1a1a' ? '#555' : '#aaa' }]}>
              {method.id === 'momo' && '📱 Xác nhận bằng ứng dụng MoMo\ncủa bạn để hoàn tất thanh toán'}
              {method.id === 'vnpay' && '🏦 Quét mã QR hoặc nhập OTP\ntừ ngân hàng của bạn'}
              {method.id === 'paypal' && '🔒 Bạn sẽ được chuyển tới\nPayPal để xác nhận'}
            </Text>
          </View>
        )}
        <TouchableOpacity style={[sSim.confirmBtn, { backgroundColor: method.color }]} onPress={handleConfirm}>
          <Text style={sSim.confirmBtnText}>{method.id === 'cash' ? 'Đặt hàng (COD)' : `Thanh toán qua ${method.label}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Text style={{ color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', fontSize: 13 }}>Huỷ & chọn lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (phase === 'processing') return (
    <View style={[sSim.wrap, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
      <View style={[sSim.gatewayBar, { backgroundColor: method.color }]}>
        <Text style={sSim.gatewayLabel}>{method.icon} {method.label} Thanh toán</Text>
      </View>
      <View style={[sSim.body, { gap: Spacing.lg }]}>
        <ActivityIndicator size="large" color={method.color} />
        <Text style={[sSim.processingText, { color: vibe.textColor }]}>Đang xử lý giao dịch...</Text>
        <Text style={[sSim.processingSubText, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Vui lòng không tắt ứng dụng</Text>
        <View style={[sSim.infoBox, { borderColor: method.color + '40', backgroundColor: vibe.borderColor + '30' }]}>
          <Text style={[sSim.infoText, { color: method.color }]}>
            {method.id === 'momo' && 'Đang kết nối tới MoMo...'}
            {method.id === 'vnpay' && 'Đang xác thực với VNPay...'}
            {method.id === 'paypal' && 'Đang xác thực với PayPal...'}
            {method.id === 'cash' && 'Đang xác nhận đơn hàng...'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[sSim.wrap, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
      <View style={[sSim.gatewayBar, { backgroundColor: result === 'success' ? '#10B981' : '#EF4444' }]}>
        <Text style={sSim.gatewayLabel}>{result === 'success' ? '✅ Thành công' : '❌ Thất bại'}</Text>
      </View>
      <View style={[sSim.body, { gap: Spacing.md }]}>
        <Animated.View style={{ transform: [{ scale: doneAnim }], opacity: doneAnim }}>
          <View style={[sSim.logoCircle, { backgroundColor: result === 'success' ? '#10B981' + '22' : '#EF4444' + '22' }]}>
            <Text style={{ fontSize: 52 }}>{result === 'success' ? '✅' : '❌'}</Text>
          </View>
        </Animated.View>
        <Text style={[sSim.merchantName, { color: vibe.textColor }]}>{result === 'success' ? 'Thanh toán thành công!' : 'Giao dịch thất bại'}</Text>
        <Text style={{ fontSize: 13, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', textAlign: 'center' }}>
          {result === 'success' ? `$${amount.toFixed(2)} đã được thanh toán qua ${method.label}` : 'Vui lòng kiểm tra lại hoặc chọn phương thức khác'}
        </Text>
        <TouchableOpacity style={[sSim.confirmBtn, { backgroundColor: result === 'success' ? '#10B981' : '#EF4444' }]} onPress={result === 'success' ? onSuccess : onFail}>
          <Text style={sSim.confirmBtnText}>{result === 'success' ? 'Xem đơn hàng' : 'Thử lại'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { vibe } = useTimeVibe();
  const [payment, setPayment] = useState(PAYMENT_METHODS[0]);
  const [showPromos, setShowPromos] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDetail, setNewDetail] = useState('');

  const { total, items, appliedPromo, applyPromo, removePromo, discount, finalTotal, createOrder, addresses, addAddress, removeAddress, selectedAddress, selectAddress } = useCart();
  const [adminPromos, setAdminPromos] = useState<any[]>([]);
  useEffect(() => {
    const loadPromos = async () => {
      const promos = await getAdminPromos();
      setAdminPromos(promos.filter(p => p.active));
    };
    loadPromos();
  }, []);
  const handlePlaceOrder = () => { if (items.length === 0) return; setShowGateway(true); };
  const handleGatewaySuccess = () => { setShowGateway(false); createOrder('Thành công'); router.replace('../order-success'); };
  const handleGatewayFail = () => { setShowGateway(false); createOrder('Thất bại'); router.replace('../order-failed'); };
  const handleAddAddress = () => { if (!newLabel.trim() || !newDetail.trim()) return; addAddress({ label: newLabel.trim(), detail: newDetail.trim() }); setNewLabel(''); setNewDetail(''); };

  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: vibe.backgroundColor, paddingHorizontal: Spacing.lg, paddingTop: 56 },
    backBtn: { width: 36, height: 36, borderRadius: Radius.sm, backgroundColor: vibe.cardBgColor, borderWidth: 1, borderColor: vibe.borderColor, justifyContent: 'center', alignItems: 'center' as const },
    title: { fontSize: 18, fontWeight: '700' as const, color: vibe.textColor },
    sectionCard: { backgroundColor: vibe.cardBgColor, borderRadius: Radius.lg, borderWidth: 1, borderColor: vibe.borderColor, padding: Spacing.md, marginBottom: Spacing.md },
    sectionCardTitle: { fontSize: 13, fontWeight: '800' as const, color: vibe.accentColor, textTransform: 'uppercase' as const, letterSpacing: 0.8, opacity: 1, },
    infoMain: { fontSize: 14, fontWeight: '600' as const, color: vibe.textColor },
    infoSub: { fontSize: 12, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', marginTop: 2 },
    infoPlaceholder: { fontSize: 14, color: vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa', flex: 1 },
    paymentChipLabel: { fontSize: 13, fontWeight: '600' as const, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' },
    summaryLabel: { fontSize: 13, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' },
    summaryValue: { fontSize: 13, color: vibe.textColor, fontWeight: '500' as const },
    totalLabel: { fontSize: 15, fontWeight: '700' as const, color: vibe.textColor },
    totalValue: { fontSize: 18, fontWeight: '700' as const, color: vibe.accentColor },
    terms: { fontSize: 12, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', textAlign: 'center' as const, marginTop: Spacing.md },
    footer: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: Spacing.lg, backgroundColor: vibe.backgroundColor, borderTopWidth: 1, borderTopColor: vibe.borderColor },
    placeBtn: { backgroundColor: vibe.accentColor, borderRadius: Radius.lg, paddingVertical: 14, paddingHorizontal: Spacing.lg, flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
    placeBtnText: { color: '#fff', fontWeight: '700' as const, fontSize: 15 },
    placeBtnPrice: { color: '#fff', fontWeight: '700' as const, fontSize: 15, backgroundColor: '#ffffff30', borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 3 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' as const },
    sheetTitle: { fontSize: 17, fontWeight: '700' as const, color: vibe.textColor, marginBottom: 4 },
    input: { borderWidth: 1, borderColor: vibe.borderColor, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: vibe.textColor, backgroundColor: vibe.borderColor + '30' },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl }}>
        <TouchableOpacity style={dynamicStyles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={vibe.textColor} />
        </TouchableOpacity>
        <Text style={dynamicStyles.title}>Đặt hàng</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Delivery address */}
        <View style={dynamicStyles.sectionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md }}>
            <Ionicons name="location-outline" size={16} color={vibe.accentColor} />
            <Text style={dynamicStyles.sectionCardTitle}>Địa chỉ giao hàng</Text>
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setShowAddress(true)}>
            <View style={{ flex: 1 }}>
              {selectedAddress ? (
                <>
                  <Text style={dynamicStyles.infoMain}>{selectedAddress.label}</Text>
                  <Text style={dynamicStyles.infoSub}>{selectedAddress.detail}</Text>
                </>
              ) : (
                <Text style={dynamicStyles.infoPlaceholder}>Chọn địa chỉ giao hàng</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} />
          </TouchableOpacity>
        </View>

        {/* Payment method */}
        <View style={dynamicStyles.sectionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md }}>
            <Ionicons name="card-outline" size={16} color={vibe.accentColor} />
            <Text style={dynamicStyles.sectionCardTitle}>Phương thức thanh toán</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm }}>
            {PAYMENT_METHODS.map(m => (
              <TouchableOpacity
                key={m.id}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  backgroundColor: vibe.borderColor, borderRadius: Radius.md,
                  borderWidth: 1.5, borderColor: payment.id === m.id ? m.color : vibe.borderColor,
                  paddingHorizontal: 12, paddingVertical: 8, position: 'relative',
                }}
                onPress={() => setPayment(m)}
              >
                <Text style={{ fontSize: 20 }}>{m.icon}</Text>
                <Text style={[dynamicStyles.paymentChipLabel, payment.id === m.id && { color: m.color }]}>{m.label}</Text>
                {payment.id === m.id && <View style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: m.color }} />}
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm }}>
            <Text style={{ fontSize: 20 }}>{payment.icon}</Text>
            <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
              <Text style={dynamicStyles.infoMain}>{payment.label}</Text>
              <Text style={dynamicStyles.infoSub}>{payment.desc}</Text>
            </View>
            <View style={{ borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: payment.color + '22' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: payment.color }}>Đã chọn</Text>
            </View>
          </View>
        </View>

        {/* Promo code */}
        <View style={dynamicStyles.sectionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md }}>
            <Ionicons name="pricetag-outline" size={16} color={vibe.accentColor} />
            <Text style={dynamicStyles.sectionCardTitle}>Mã giảm giá</Text>
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setShowPromos(true)}>
            {appliedPromo ? (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: vibe.accentColor + '20', borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: vibe.accentColor }}>{appliedPromo.code}</Text>
                </View>
                <Text style={{ color: '#10B981', fontSize: 13 }}>-{appliedPromo.percent}% giảm</Text>
              </View>
            ) : (
              <Text style={dynamicStyles.infoPlaceholder}>Chọn voucher</Text>
            )}
            {appliedPromo ? (
              <TouchableOpacity onPress={removePromo}><Ionicons name="close-circle" size={18} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} /></TouchableOpacity>
            ) : (
              <Ionicons name="chevron-forward" size={16} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} />
            )}
          </TouchableOpacity>
        </View>

        {/* Order summary */}
        <View style={dynamicStyles.sectionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md }}>
            <Ionicons name="receipt-outline" size={16} color={vibe.accentColor} />
            <Text style={dynamicStyles.sectionCardTitle}>Tóm tắt đơn hàng</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={dynamicStyles.summaryLabel}>Tạm tính</Text>
            <Text style={dynamicStyles.summaryValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={dynamicStyles.summaryLabel}>Giao hàng</Text>
            <Text style={[dynamicStyles.summaryValue, { color: '#10B981' }]}>Miễn phí</Text>
          </View>
          {appliedPromo && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={[dynamicStyles.summaryLabel, { color: '#10B981' }]}>Giảm</Text>
              <Text style={[dynamicStyles.summaryValue, { color: '#10B981' }]}>-${discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={{ height: 1, backgroundColor: vibe.borderColor, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={dynamicStyles.totalLabel}>Tổng tiền</Text>
            <Text style={dynamicStyles.totalValue}>${finalTotal.toFixed(2)}</Text>
          </View>
          {appliedPromo && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={{ fontSize: 12, color: '#10B981' }}>Bạn tiết kiệm được ${discount.toFixed(2)} 🎉</Text>
            </View>
          )}
        </View>

        <Text style={dynamicStyles.terms}>Bằng cách đặt hàng, bạn đồng ý với <Text style={{ color: vibe.accentColor }}>Điều khoản sử dụng</Text></Text>
      </ScrollView>

      <View style={dynamicStyles.footer}>
        <TouchableOpacity style={dynamicStyles.placeBtn} onPress={handlePlaceOrder} activeOpacity={0.85}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="bag-check-outline" size={18} color="#fff" />
            <Text style={dynamicStyles.placeBtnText}>Thanh toán qua {payment.label}</Text>
          </View>
          <Text style={dynamicStyles.placeBtnPrice}>${finalTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <Modal visible={showGateway} transparent animationType="slide">
        <View style={dynamicStyles.overlay}>
          <PaymentSimulator method={payment} amount={finalTotal} onSuccess={handleGatewaySuccess} onFail={handleGatewayFail} onCancel={() => setShowGateway(false)} vibe={vibe} />
        </View>
      </Modal>

      <Modal visible={showAddress} transparent animationType="slide">
        <View style={dynamicStyles.overlay}>
          <View style={[sSheet.sheet, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
            <Text style={[sSheet.sheetTitle, { color: vibe.textColor }]}>Địa chỉ giao hàng</Text>
            {addresses.length === 0 && <Text style={{ color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', fontSize: 13 }}>Chưa có địa chỉ nào</Text>}
            {addresses.map((a: any) => (
              <TouchableOpacity
                key={a.id}
                style={[sSheet.addrRow, selectedAddress?.id === a.id && { borderColor: vibe.accentColor, backgroundColor: vibe.accentColor + '20' }, { borderColor: vibe.borderColor }]}
                onPress={() => { selectAddress(a); setShowAddress(false); }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: vibe.textColor }}>{a.label}</Text>
                  <Text style={{ fontSize: 13, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', marginTop: 2 }}>{a.detail}</Text>
                </View>
                <TouchableOpacity onPress={() => removeAddress(a.id)}><Ionicons name="trash-outline" size={16} color="#EF4444" /></TouchableOpacity>
                {selectedAddress?.id === a.id && <Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginLeft: 8 }} />}
              </TouchableOpacity>
            ))}
            <View style={{ gap: 8, marginTop: 12 }}>
              <TextInput style={dynamicStyles.input} placeholder="Tên địa chỉ (vd: Nhà, Công ty)" placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa'} value={newLabel} onChangeText={setNewLabel} />
              <TextInput style={dynamicStyles.input} placeholder="Địa chỉ chi tiết" placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa'} value={newDetail} onChangeText={setNewDetail} />
              <TouchableOpacity style={[dynamicStyles.placeBtn, (!newLabel || !newDetail) && { opacity: 0.4 }]} disabled={!newLabel || !newDetail} onPress={handleAddAddress}>
                <Text style={[dynamicStyles.placeBtnText, { textAlign: 'center' }]}>+ Thêm địa chỉ</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={sSheet.sheetClose} onPress={() => setShowAddress(false)}>
              <Text style={{ color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', fontWeight: '600' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showPromos} transparent animationType="slide">
        <View style={dynamicStyles.overlay}>
          <View style={[sSheet.sheet, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
            <Text style={[sSheet.sheetTitle, { color: vibe.textColor }]}>Chọn voucher</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              {adminPromos.length === 0 ? (
                <Text style={{ color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', textAlign: 'center', padding: 20 }}>
                  Chưa có mã giảm giá nào
                </Text>
              ) : (
                adminPromos.map((p: any) => {
                  const eligible = total >= p.minOrder;
                  const isApplied = appliedPromo?.code === p.code;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[sSheet.promoRow, !eligible && { opacity: 0.35 }, isApplied && { borderColor: '#10B981', backgroundColor: '#10B98120' }, { borderColor: vibe.borderColor }]}
                      disabled={!eligible}
                      onPress={() => { applyPromo(p.code); setShowPromos(false); }}
                    >
                      <View style={sSheet.promoDiscount}>
                        <Text style={sSheet.promoDiscountText}>-{p.percent}%</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: Spacing.md }}>
                        <Text style={{ fontWeight: '700', color: vibe.textColor }}>{p.label}</Text>
                        {p.minOrder > 0 && <Text style={{ fontSize: 11, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', marginTop: 2 }}>Đơn tối thiểu ${p.minOrder}</Text>}
                        <Text style={{ fontSize: 11, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', marginTop: 2, fontFamily: 'monospace' }}>{p.code}</Text>
                      </View>
                      {isApplied && <Ionicons name="checkmark-circle" size={20} color="#10B981" />}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
            <TouchableOpacity style={sSheet.sheetClose} onPress={() => setShowPromos(false)}>
              <Text style={{ color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa', fontWeight: '600' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles cho sheet và simulator
const sSim = StyleSheet.create({
  wrap: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', borderTopWidth: 1 },
  gatewayBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  gatewayLabel: { color: '#fff', fontWeight: '700', fontSize: 15 },
  body: { alignItems: 'center', padding: 24, gap: 8 },
  logoCircle: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  merchantName: { fontSize: 17, fontWeight: '700' },
  amountLabel: { fontSize: 13 },
  amountValue: { fontSize: 32, fontWeight: '700' },
  infoBox: { borderRadius: 10, borderWidth: 1, padding: 16, alignSelf: 'stretch' },
  infoText: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  confirmBtn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24, alignSelf: 'stretch', alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  processingText: { fontSize: 17, fontWeight: '600' },
  processingSubText: { fontSize: 13 },
});

const sSheet = StyleSheet.create({
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 10, borderTopWidth: 1 },
  sheetTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  sheetClose: { alignItems: 'center', paddingVertical: 12 },
  addrRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: 10 },
  promoRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: 10 },
  promoDiscount: { backgroundColor: '#10B98122', borderRadius: 8, padding: 8, minWidth: 48, alignItems: 'center' },
  promoDiscountText: { fontWeight: '800', color: '#10B981', fontSize: 15 },
});