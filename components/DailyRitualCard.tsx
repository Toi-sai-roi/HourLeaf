import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useRef } from 'react';
import { useTimeVibe } from '../hooks/useTimeVibe';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from '../constants/products';
import { Radius, Spacing } from '../constants/Colors';
import { useHaptic } from '../hooks/useHaptic';
import { Ionicons } from '@expo/vector-icons';

export function DailyRitualCard() {
  const { timeOfDay, vibe } = useTimeVibe();
  const { addItem } = useCart();
  const { lightImpact } = useHaptic();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!vibe.ritualCard) return null;

  const { title, subtitle, desc, productId } = vibe.ritualCard;

  const handleAddRitual = () => {
    lightImpact();
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    if (productId) {
      const product = ALL_PRODUCTS.find(p => p.id === productId);
      if (product) {
        addItem({ ...product, img: null });
      }
    }
  };

  // Lấy icon theo timeOfDay
  const getIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'dawn': return <Ionicons name="sunny-outline" size={28} color="#FFD700" />;
      case 'morning': return <Ionicons name="cafe-outline" size={28} color="#D4AF37" />;
      case 'noon': return <Ionicons name="restaurant-outline" size={28} color="#FF8C42" />;
      case 'afternoon': return <Ionicons name="ice-cream-outline" size={28} color="#d269fc" />;
      case 'evening': return <Ionicons name="beer-outline" size={28} color="#F4A261" />;
      case 'night': return <Ionicons name="moon-outline" size={28} color="#A29BFE" />;
      default: return <Ionicons name="leaf-outline" size={28} color="#D4AF37" />;
    }
  };
  const getButtonIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'dawn': return <Ionicons name="leaf-outline" size={18} color="#fff" />;
      case 'morning': return <Ionicons name="happy-outline" size={18} color="#fff" />;
      case 'noon': return <Ionicons name="timer-outline" size={18} color="#fff" />;
      case 'afternoon': return <Ionicons name="cafe-outline" size={18} color="#fff" />;
      case 'evening': return <Ionicons name="bonfire-outline" size={18} color="#fff" />;
      case 'night': return <Ionicons name="bed-outline" size={18} color="#fff" />;
      default: return <Ionicons name="add-outline" size={18} color="#fff" />;
    }
  };
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handleAddRitual}>
      <Animated.View
        style={[
          s.card,
          {
            backgroundColor: vibe.accentColor + '15',
            borderColor: vibe.accentColor,
            borderLeftColor: vibe.accentColor,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={s.iconWrapper}>
          {getIcon(timeOfDay)}
        </View>

        <View style={s.content}>
          <Text style={[s.title, { color: '#FFD700' }]}>{title}</Text>
          <Text style={[s.subtitle, { color: '#FFFFFF' }]}>{subtitle}</Text>
          <Text style={[s.desc, { color: '#E0E0E0' }]}>{desc}</Text>
        </View>

        <View style={[s.ctaWrapper, { backgroundColor: vibe.accentColor }]}>
          {getButtonIcon(timeOfDay)}
        </View>

      </Animated.View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.lg, borderWidth: 1.5, borderLeftWidth: 4, padding: Spacing.md, marginBottom: Spacing.xl, gap: 12 },

  iconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  iconEmoji: { fontSize: 28 },

  content: { flex: 1 },
  title: { fontSize: 13, fontWeight: '700', marginBottom: 4, letterSpacing: 0.5 },
  subtitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  desc: { fontSize: 11 },

  ctaWrapper: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  ctaText: { color: 'hotpink', fontSize: Platform.OS === 'ios' ? 26 : 30, lineHeight: Platform.OS === 'ios' ? 30 : 34, textAlign: 'center', },
});