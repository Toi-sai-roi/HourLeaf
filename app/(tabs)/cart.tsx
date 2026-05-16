// app/(tabs)/cart.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useTimeVibe } from "../../hooks/useTimeVibe";
import { Palette, Radius, Spacing } from "../../constants/Colors";
import { useHaptic } from '../../hooks/useHaptic';

function CartScreenContent() {
  const router = useRouter();
  const { items, total, count, updateQty, removeItem } = useCart();
  const { vibe } = useTimeVibe();
  const { lightImpact, mediumImpact } = useHaptic();

  if (count === 0) {
    return (
      <View style={{ flex: 1 }}>
        <View style={[s.emptyContainer, { backgroundColor: vibe.backgroundColor }]}>
          <Text style={s.emptyIcon}>🛒</Text>
          <Text style={[s.emptyTitle, { color: vibe.textColor }]}>Giỏ hàng trống</Text>
          <Text style={[s.emptyDesc, { color: vibe.textColor }]}>Thêm sản phẩm để bắt đầu mua sắm nhé!</Text>
          <TouchableOpacity style={[s.shopBtn, { backgroundColor: vibe.accentColor }]} onPress={() => router.push("/(tabs)")}>
            <Text style={s.shopBtnText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.container, { backgroundColor: vibe.backgroundColor }]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={vibe.textColor} />
          </TouchableOpacity>
          <Text style={[s.title, { color: vibe.textColor }]}>Giỏ hàng ({count})</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {items.map((item, idx) => (
            <CartItem
              key={item.id}
              item={item}
              index={idx}
              onIncrease={() => updateQty(item.id, 1)}
              onDecrease={() => updateQty(item.id, -1)}
              onRemove={() => removeItem(item.id)}
              vibe={vibe}
              onLightImpact={lightImpact}      // ← truyền xuống
              onMediumImpact={mediumImpact}    // ← truyền xuống
            />
          ))}
        </ScrollView>

        <View style={[s.footer, { backgroundColor: vibe.cardBgColor, borderTopColor: vibe.borderColor }]}>
          <View style={s.totalRow}>
            <Text style={[s.totalLabel, { color: vibe.textColor }]}>Tổng cộng</Text>
            <Text style={[s.totalPrice, { color: vibe.accentColor }]}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[s.checkoutBtn, { backgroundColor: vibe.accentColor }]}
            onPress={() => router.push("/checkout")}
            activeOpacity={0.8}
          >
            <Text style={s.checkoutText}>Tiến hành thanh toán</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function CartItem({ item, index, onIncrease, onDecrease, onRemove, vibe, onLightImpact, onMediumImpact }: any) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  return (
    <Animated.View style={[s.item, { opacity: anim, transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }], backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
      <Text style={s.itemIcon}>{item.icon}</Text>
      <View style={s.itemInfo}>
        <Text style={[s.itemName, { color: vibe.textColor }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[s.itemWeight, { color: vibe.textColor }]}>{item.weight}</Text>
        <Text style={[s.itemPrice, { color: vibe.accentColor }]}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={s.quantityControl}>
        <TouchableOpacity style={[s.qtyBtn, { backgroundColor: vibe.borderColor }]} onPress={() => {
          onLightImpact?.();
          onDecrease();
        }}>
          <Text style={[s.qtyBtnText, { color: vibe.textColor }]}>-</Text>
        </TouchableOpacity>
        <Text style={[s.qtyText, { color: vibe.textColor }]}>{item.qty}</Text>
        <TouchableOpacity style={[s.qtyBtn, { backgroundColor: vibe.borderColor }]} onPress={() => {
          onLightImpact?.();
          onIncrease();
        }}>
          <Text style={[s.qtyBtnText, { color: vibe.textColor }]}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.removeBtn} onPress={() => {
          onMediumImpact?.();
          onRemove();
        }}>
          <Ionicons name="trash-outline" size={18} color={vibe.textColor === '#1a1a1a' ? '#999' : Palette.textDisabled} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function CartScreen() {
  return <CartScreenContent />;
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 52 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptyDesc: { fontSize: 14, marginBottom: 24 },
  shopBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.md },
  shopBtnText: { color: '#fff', fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '700' },
  item: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.md },
  itemIcon: { fontSize: 30, marginRight: Spacing.sm },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', marginBottom: 2, flexWrap: 'wrap', flex: 1 },
  itemWeight: { fontSize: 12, marginBottom: 4 },
  itemPrice: { fontSize: 15, fontWeight: '700' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: Radius.sm, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '600' },
  qtyText: { fontSize: 14, fontWeight: '600', minWidth: 24, textAlign: 'center' },
  removeBtn: { marginLeft: 4, padding: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, borderTopWidth: 1 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  totalLabel: { fontSize: 16, fontWeight: '600' },
  totalPrice: { fontSize: 22, fontWeight: '700' },
  checkoutBtn: { borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  checkoutText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});