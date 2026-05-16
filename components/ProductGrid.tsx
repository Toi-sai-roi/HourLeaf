// components/ProductGrid.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { Product } from '../constants/products';
import { Radius, Spacing } from '../constants/Colors';
import { useHaptic } from '../hooks/useHaptic';

interface ProductGridProps {
  products: Product[];
  title?: string;
  columns?: 2 | 4;
  textColor?: string;
  cardBgColor?: string;
  borderColor?: string;
  accentColor?: string;
  priceColor?: string;
}

export function ProductGrid({
  products,
  title,
  columns = 2,
  textColor = '#1a1a1a',
  cardBgColor = '#FFFFFF',
  borderColor = '#E0E0E0',
  accentColor = '#27AE60',
  priceColor
}: ProductGridProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { lightImpact } = useHaptic();

  if (!products || products.length === 0) return null;

  const columnWidth = columns === 2 ? '48%' : '31%';
  const finalPriceColor = priceColor || accentColor;

  return (
    <View style={s.container}>
      {title && <Text style={[s.title, { color: textColor }]}>{title}</Text>}
      <View style={s.grid}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[s.card, { width: columnWidth, backgroundColor: cardBgColor, borderColor }]}
            onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
            activeOpacity={0.8}
          >
            <Text style={s.icon}>{product.icon}</Text>
            <Text style={[s.name, { color: textColor }]} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={[s.weight, { color: textColor }]}>{product.weight}</Text>
            <View style={s.cardFooter}>
              <Text style={[s.price, { color: finalPriceColor }]}>${product.price.toFixed(2)}</Text>
              <TouchableOpacity
                style={[s.addBtn, { backgroundColor: accentColor + '30' }]}
                onPress={(e) => {
                  e.stopPropagation();
                  lightImpact();
                  addItem({ ...product, img: null });
                }}
              >
                <Text style={[s.addBtnText, { color: accentColor }]}>+</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, alignItems: 'center', marginBottom: 12 },
  icon: { fontSize: 40, marginBottom: Spacing.sm },
  name: { fontSize: 12, fontWeight: '700', textAlign: 'center', marginBottom: 2 },
  weight: { fontSize: 11, marginBottom: Spacing.sm },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  price: { fontSize: 14, fontWeight: '700' },
  addBtn: { borderRadius: Radius.sm, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { fontSize: 18, fontWeight: '600' },
});