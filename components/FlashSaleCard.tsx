import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTimeVibe } from '../hooks/useTimeVibe';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from '../constants/products';
import { Palette, Radius, Spacing } from '../constants/Colors';
import { getFlashSales, FlashSale } from '../services/AdminService';

export function FlashSaleCard() {
  const router = useRouter();
  const { addItem } = useCart();
  const { vibe, effectiveHour } = useTimeVibe();
  const [flashSales, setFlashSales] = useState<(FlashSale & { product: any })[]>([]);
  const [timeLeft, setTimeLeft] = useState('');

  // Xác định % giảm theo khung giờ
  const getDiscountPercent = () => {
    if (effectiveHour >= 17 && effectiveHour < 20) return 10;
    if (effectiveHour >= 21 && effectiveHour < 24) return 30;
    return 0;
  };

  const discountPercent = getDiscountPercent();
  const isFlashSaleActive = discountPercent > 0;

  useEffect(() => {
    const loadFlashSales = async () => {
      const sales = await getFlashSales();
      const now = new Date();
      const activeSales = sales.filter(s =>
        s.active && new Date(s.startDate) <= now && new Date(s.endDate) >= now
      );

      const salesWithProducts = activeSales.map(sale => ({
        ...sale,
        product: ALL_PRODUCTS.find(p => p.id === sale.productId)
      })).filter(s => s.product);

      setFlashSales(salesWithProducts);
    };
    loadFlashSales();
  }, []);

  useEffect(() => {
    if (!isFlashSaleActive) return;
    const timer = setInterval(() => {
      const now = new Date();
      let target: Date;
      if (effectiveHour >= 17 && effectiveHour < 20) {
        target = new Date();
        target.setHours(20, 0, 0, 0);
      } else if (effectiveHour >= 21) {
        target = new Date();
        target.setHours(24, 0, 0, 0); 
      } else {
        return;
      }
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Đã kết thúc');
        return;
      }
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 1000);
    return () => clearInterval(timer);
  }, [effectiveHour, isFlashSaleActive]);

  if (!vibe.flashSale || !isFlashSaleActive) return null;

  return (
    <View style={s.container}>
      <TouchableOpacity style={[s.timerCard, { backgroundColor: Palette.card, borderColor: Palette.goldMid }]} onPress={() => router.push('/admin/flash-sales')} activeOpacity={0.8}>
        <View style={s.header}>
          <Text style={s.fireIcon}>🔥</Text>
          <Text style={s.title}>FLASH SALE</Text>
        </View>
        <Text style={s.timer}>Kết thúc sau: {timeLeft}</Text>
        <Text style={s.desc}>Giảm {discountPercent}% - Đang diễn ra</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.horizontalList}>
        {flashSales.map((sale) => (
          <TouchableOpacity
            key={sale.id}
            style={[s.productCard, { backgroundColor: Palette.card, borderColor: Palette.border }]}
            onPress={() => router.push({ pathname: '/product/[id]', params: { id: sale.product.id } })}
            activeOpacity={0.8}
          >
            <Text style={s.productIcon}>{sale.product.icon}</Text>
            <Text style={s.productName} numberOfLines={1}>{sale.product.name}</Text>
            <View style={s.priceRow}>
              <Text style={s.oldPrice}>${sale.product.price.toFixed(2)}</Text>
              <Text style={s.newPrice}>${(sale.product.price * (1 - discountPercent / 100)).toFixed(2)}</Text>
            </View>
            <View style={s.discountBadge}>
              <Text style={s.discountBadgeText}>-{discountPercent}%</Text>
            </View>
            <TouchableOpacity
              style={[s.addBtn, { backgroundColor: Palette.purple }]}
              onPress={(e) => {
                e.stopPropagation();
                addItem({ ...sale.product, img: null });
              }}
            >
              <Text style={s.addBtnText}>+</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: Spacing.xl },
  timerCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  fireIcon: { fontSize: 20 },
  title: {
  fontSize: 14,
  fontWeight: '700',
  color: Palette.gold,
  letterSpacing: 1,
  textShadowColor: 'rgba(0,0,0,0.5)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,
},
timer: {
  fontSize: 20,
  fontWeight: '700',
  color: Palette.textPrimary,
  marginBottom: 4,
  textShadowColor: 'rgba(0,0,0,0.5)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,
},
desc: {
  fontSize: 12,
  color: Palette.textSecondary,
  textShadowColor: 'rgba(0,0,0,0.3)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 2,
},
  horizontalList: { flexDirection: 'row' },
  productCard: { width: 140, borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginRight: Spacing.md, alignItems: 'center', position: 'relative' },
  productIcon: { fontSize: 44, marginBottom: Spacing.sm },
  productName: { fontSize: 13, fontWeight: '600', color: Palette.textPrimary, textAlign: 'center', marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.sm },
  oldPrice: { fontSize: 11, color: Palette.textDisabled, textDecorationLine: 'line-through' },
  newPrice: { fontSize: 14, fontWeight: '700', color: Palette.gold },
  discountBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#EF4444', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2 },
  discountBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  addBtn: { borderRadius: Radius.sm, width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: Palette.textPrimary, fontSize: 18, fontWeight: '600' },
});