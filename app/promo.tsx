import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { useTimeVibe } from '../hooks/useTimeVibe';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getAdminPromos, AdminPromo } from '../services/AdminService';
import { Spacing } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

// --- 1. Tách PromoCard thành Component riêng ---
const PromoCard = ({ p, idx, vibe, appliedPromo, total, applyPromo, removePromo }: any) => {
  const cardAnim = useRef(new Animated.Value(0)).current;
  const isApplied = appliedPromo?.code === p.code;
  const eligible = total >= p.minOrder;

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 400,
      delay: idx * 100,
      useNativeDriver: true,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View 
      style={{ 
        transform: [{ 
          translateX: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) 
        }], 
        opacity: cardAnim 
      }}
    >
      <TouchableOpacity
        style={[
          s.card,
          { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor },
          isApplied && { borderColor: vibe.accentColor, backgroundColor: vibe.accentColor + '20' },
          !eligible && { opacity: 0.6 }
        ]}
        onPress={() => isApplied ? removePromo() : eligible && applyPromo(p.code)}
        disabled={!eligible}
      >
        <LinearGradient
          colors={['#FFD166', '#F4A261']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.gradientStrip}
        />
        <View style={s.cardContent}>
          <View style={s.left}>
            <Text style={[s.percent, { color: '#E76F51' }]}>-{p.percent}%</Text>
            <Text style={[s.label, { color: vibe.textColor }]}>{p.label}</Text>
            {p.minOrder > 0 && (
              <Text style={[s.min, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>💰 Đơn tối thiểu ${p.minOrder}</Text>
            )}
            <View style={s.codeWrapper}>
              <Text style={[s.code, { color: '#E76F51' }]}>{p.code}</Text>
            </View>
          </View>
          <View style={[s.badge, isApplied && { backgroundColor: '#E76F51' }]}>
            <Text style={[s.badgeText, { color: isApplied ? '#fff' : '#E76F51' }]}>
              {isApplied ? '✅ ĐÃ DÙNG' : '🤑 LẤY NGAY'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- 2. Component chính ---
export default function PromoScreen() {
  const router = useRouter();
  const { vibe } = useTimeVibe();
  const { appliedPromo, applyPromo, removePromo, total } = useCart();
  const [promos, setPromos] = useState<AdminPromo[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getAdminPromos();
        setPromos(data.filter(p => p.active));
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      };
      load();
    }, [fadeAnim])
  );

  if (!promos.length) {
    return (
      <View style={[s.emptyContainer, { backgroundColor: vibe.backgroundColor }]}>
        <Text style={{ fontSize: 64 }}>🎟️</Text>
        <Text style={[s.emptyTitle, { color: vibe.textColor }]}>Chưa có voucher</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[s.backText, { color: vibe.accentColor }]}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: fadeAnim }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={vibe.textColor} />
        </TouchableOpacity>
        <Text style={[s.title, { color: vibe.textColor }]}>🎁 Săn voucher khủng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 16 }}>
        {promos.map((p, idx) => (
          <PromoCard 
            key={p.id}
            p={p}
            idx={idx}
            vibe={vibe}
            appliedPromo={appliedPromo}
            total={total}
            applyPromo={applyPromo}
            removePromo={removePromo}
          />
        ))}
      </ScrollView>

      <View style={s.stickyNote}>
        <Text style={[s.noteText, { color: vibe.accentColor }]}>🔥 Số lượng có hạn, nhanh tay nhé! 🔥</Text>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  // Giữ nguyên các style cũ của bạn
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 52 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  backText: { fontSize: 15, fontWeight: '600', textDecorationLine: 'underline' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '900' },
  card: { borderRadius: 24, marginBottom: 8, overflow: 'hidden', borderWidth: 1, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  gradientStrip: { height: 8 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  left: { flex: 1 },
  percent: { fontSize: 28, fontWeight: '900', marginBottom: 4 },
  label: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  min: { fontSize: 12, marginBottom: 6 },
  codeWrapper: { backgroundColor: '#FFD16630', borderRadius: 20, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, marginTop: 4 },
  code: { fontSize: 13, fontWeight: '800' },
  badge: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 30, borderWidth: 1, borderColor: '#E76F51', backgroundColor: '#fff' },
  badgeText: { fontSize: 14, fontWeight: '900' },
  stickyNote: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  noteText: { fontSize: 13, fontWeight: '800', backgroundColor: '#FFD166', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 40, overflow: 'hidden' },
});