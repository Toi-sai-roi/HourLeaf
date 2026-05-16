// components/VibeOfferCard.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTimeVibe } from '../hooks/useTimeVibe';
import { useCart } from '../context/CartContext';
import { Radius, Spacing } from '../constants/Colors';

const OFFER_BY_TIME: Record<string, { title: string; desc: string; code: string; discount: number; productId?: string; message: string; }> = {
  dawn: { title: "Ưu đãi ban mai", desc: "Cho những người dậy sớm", code: "DAWN15", discount: 15, productId: "coffee1", message: "🎁 Đã áp dụng mã DAWN15 - Giảm 15% cho cà phê!" },
  morning: { title: "Sáng khoẻ", desc: "Nạp năng lượng ngay", code: "MORNING10", discount: 10, productId: "7", message: "🎁 Đã áp dụng mã MORNING10 - Giảm 10% cho trứng sữa!" },
  noon: { title: "Trưa nhanh", desc: "Pork ribs siêu ngon", code: "NOON20", discount: 20, productId: "m4", message: "🎁 Đã áp dụng mã NOON20 - Giảm 20% cho sườn heo!" },
  afternoon: { title: "Chiều vui", desc: "Milk tea giảm sâu", code: "AFTERNOON15", discount: 15, productId: "bv4", message: "🎁 Đã áp dụng mã AFTERNOON15 - Giảm 15% cho trà sữa!" },
  evening: { title: "Tối rộn ràng", desc: "Snack cho buổi tối", code: "EVENING25", discount: 25, productId: "bk4", message: "🎁 Đã áp dụng mã EVENING25 - Giảm 25% cho snack!" },
  night: { title: "Đêm thức", desc: "Dành riêng cho cú đêm", code: "NIGHT30", discount: 30, message: "🎁 Đã áp dụng mã NIGHT30 - Giảm 30% toàn bộ đơn hàng!" },
  lateNight: { title: "", desc: "", code: "", discount: 0, message: "" },
};

export function VibeOfferCard() {
  const router = useRouter();
  const { timeOfDay, vibe } = useTimeVibe();
  const { applyPromo, removePromo, appliedPromo, total } = useCart();
  const offer = OFFER_BY_TIME[timeOfDay] ?? OFFER_BY_TIME.morning;

  if (offer.discount === 0) return null;

  const isApplied = appliedPromo?.code === offer.code;
  const isEligible = total >= (offer.code === 'NOON20' ? 15 : offer.code === 'EVENING25' ? 20 : offer.code === 'NIGHT30' ? 25 : 0);

  const handlePress = () => {
    if (isApplied) {
      removePromo();
      alert(`Đã xóa mã ${offer.code}`);
    } else {
      if (applyPromo(offer.code)) {
        alert(offer.message);
        // Nếu có sản phẩm kèm theo, chuyển sang trang sản phẩm
        if (offer.productId) {
          router.push({ pathname: "/product/[id]", params: { id: offer.productId } });
        }
      } else {
        alert(`Không thể áp dụng ${offer.code}. Đơn hàng tối thiểu ${offer.code === 'NOON20' ? '$15' : offer.code === 'EVENING25' ? '$20' : '$25'}`);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        s.container,
        {
          backgroundColor: isApplied ? vibe.accentColor + '20' : vibe.cardBgColor,
          borderColor: isApplied ? vibe.accentColor : vibe.accentColor + '80'
        }
      ]}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <View style={[s.decoCircle1, { backgroundColor: vibe.accentColor + '20' }]} />
      <View style={[s.decoCircle2, { backgroundColor: vibe.accentColor + '30' }]} />

      <View style={s.content}>
        <View>
          <Text style={[s.tag, { color: vibe.accentColor }]}>
            {isApplied ? '✅ ĐÃ ÁP DỤNG' : '🔥 GIỜ VÀNG'}
          </Text>
          <Text style={[s.title, { color: vibe.textColor }]}>{offer.title}</Text>
          <Text style={[s.desc, { color: vibe.textColor === '#1a1a1a' ? '#666' : '#aaa' }]}>{offer.desc}</Text>
          {!isEligible && (
            <Text style={[s.warning, { color: '#f44336' }]}>
              *Đơn tối thiểu ${offer.code === 'NOON20' ? '15' : offer.code === 'EVENING25' ? '20' : '25'}
            </Text>
          )}
        </View>
        <View style={s.codeSection}>
          <Text style={[s.code, { color: vibe.accentColor, borderColor: vibe.accentColor }]}>
            {isApplied ? '✓ ĐÃ DÙNG' : offer.code}
          </Text>
          <Text style={[s.discount, { color: vibe.accentColor }]}>-{offer.discount}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: { borderRadius: Radius.xl, borderWidth: 1.5, padding: Spacing.lg, marginBottom: Spacing.md, overflow: 'hidden', position: 'relative' },
  
  decoCircle1: { position: 'absolute', width: 120, height: 120, borderRadius: 60, right: -40, top: -40 },
  decoCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, right: 20, bottom: -20 },
  
  content: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 },
  
  tag: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  discount: { fontSize: 20, fontWeight: '800', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  
  desc: { fontSize: 12 },
  warning: { fontSize: 10, marginTop: 4 },
  
  codeSection: { alignItems: 'flex-end', gap: 4 },
  code: { fontSize: 13, fontWeight: '700', borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, fontFamily: 'monospace', letterSpacing: 1 },
});