// app/category/[name].tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated, } from "react-native";
import { ALL_PRODUCTS } from "../../constants/products";
import { useCart } from "../../context/CartContext";
import { useTimeVibe } from "../../hooks/useTimeVibe";
import { Spacing } from "../../constants/Colors";
import { useHaptic } from '../../hooks/useHaptic';

const CATEGORY_TITLES: Record<string, string> = {
  beverages: "Nước uống",
  fruits: "Trái Cây & Rau Củ",
  oil: "Dầu ăn",
  meat: "Thịt & Cá",
  bakery: "Bánh & Snack",
  dairy: "Sữa & Trứng",
  pulses: "Các loại đậu",
  rice: "Gạo",
};

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { vibe } = useTimeVibe();
  const pageAnim = useRef(new Animated.Value(0)).current;
  const { lightImpact } = useHaptic();

  useEffect(() => {
    Animated.timing(pageAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [pageAnim]);

  const products = ALL_PRODUCTS.filter((p) => p.category === name);
  const title = CATEGORY_TITLES[name] ?? name;

  return (
    <Animated.View style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: pageAnim }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={vibe.textColor} />
        </TouchableOpacity>
        <Text style={[s.title, { color: vibe.textColor }]}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {products.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[s.card, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Text style={s.icon}>{item.icon}</Text>
              <Text style={[s.volume, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>{item.weight}</Text>
              <Text style={[s.name, { color: vibe.textColor }]} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={s.footer}>
                <Text style={[s.price, { color: vibe.accentColor }]}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={[s.addBtn, { backgroundColor: vibe.accentColor }]}
                  onPress={() => {
                    lightImpact();
                    addItem({ ...item, img: null });
                  }}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 52 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "47%", borderWidth: 1, borderRadius: 16, padding: 12, alignItems: "center", minHeight: 180, justifyContent: "space-between" },
  icon: { fontSize: 52, marginBottom: 8 },
  volume: { fontSize: 11, marginBottom: 2, alignSelf: "flex-start" },
  name: { fontSize: 13, fontWeight: "600", marginBottom: 8, alignSelf: "flex-start", height: 36 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  price: { fontSize: 15, fontWeight: "700" },
  addBtn: { borderRadius: 8, width: 30, height: 30, justifyContent: "center", alignItems: "center" },
});