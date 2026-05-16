import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTimeVibe } from '../hooks/useTimeVibe';
import { Radius, Spacing, Typography } from '../constants/Colors';

export function LiveDealBanner() {
  const router = useRouter();
  const { timeOfDay, vibe, effectiveHour } = useTimeVibe();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isFlashHour = (effectiveHour >= 17 && effectiveHour < 20) || (effectiveHour >= 21 && effectiveHour < 23);

  useEffect(() => {
    if (isFlashHour) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (timeOfDay === 'lateNight') return null;

  if (!isFlashHour) {
    return (
      <View style={[s.container, { backgroundColor: vibe.accentColor + '15', borderColor: vibe.accentColor }]}>
  <View style={s.left}>
    <Text style={s.icon}>🎁</Text>
    <View>
      <Text style={[s.title, { color: '#e53232' }]}>FLASH SALE</Text>
      <Text style={[s.subtitle, { color: '#f9f9f6', fontWeight: '600' }]}>Lúc 17h - 20h và 21h - 23h</Text>
    </View>
  </View>
  <View style={s.right}>
    <Text style={[s.cta, { color: '#f51049' }]}>Xem lịch</Text>
    <Ionicons name="calendar-outline" size={16} color="#f51049" />
  </View>
</View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/admin/flash-sales')}>
      <Animated.View style={[s.container, { backgroundColor: vibe.accentColor + '15', borderColor: vibe.accentColor, transform: [{ scale: pulseAnim }] }]}>
        <View style={s.left}>
          <Text style={s.icon}>🔥</Text>
          <View>
            <Text style={[s.title, { color: '#FFD700' }]}>FLASH SALE</Text>  
            <Text style={[s.subtitle, { color: '#FFFFFF' }]}>Giảm sốc trong giờ vàng</Text>  
          </View>
        </View>
        <View style={s.right}>
          <Text style={[s.cta, { color: '#FFD700' }]}>Mua ngay</Text>    
          <Ionicons name="arrow-forward" size={16} color='#FFD700' />  
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  left: { flexDirection: 'row', alignItems: 'center',  gap: 12, flex: 2, },
  icon: { fontSize: 32 },
  title: { fontWeight: '700', ...Typography.default },
  subtitle: { ...Typography.caption },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6, },
  cta: { fontSize: 12, fontWeight: '600' },
});