import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import { ALL_PRODUCTS } from "../../constants/products";
import { useCart } from "../../context/CartContext";
import { useTimeVibe } from "../../hooks/useTimeVibe";
import { Spacing } from "../../constants/Colors";
import { useHaptic } from '../../hooks/useHaptic';

const TITLES: Record<string, string> = {
  exclusive: "Ưu đãi độc quyền",
  bestselling: "Sản phẩm bán chạy",
};

export default function SectionScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
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

  const products = ALL_PRODUCTS.filter((p) => p.tags?.includes(tag as any));
  const title = TITLES[tag] ?? "Products";

  return (
    <Animated.View style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: pageAnim }]}>
      <View style={[s.header, { borderColor: vibe.borderColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={vibe.textColor} />
        </TouchableOpacity>
        <Text style={[s.title, { color: vibe.textColor }]}>{title}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {products.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[s.card, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}
              onPress={() => router.push({ pathname: "/product/[id]", params: { id: p.id } })}
            >
              <Text style={s.cardIcon}>{p.icon}</Text>
              <Text style={[s.cardWeight, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>{p.weight}</Text>
              <Text style={[s.cardName, { color: vibe.textColor }]} numberOfLines={2}>{p.name}</Text>
              <View style={s.cardFooter}>
                <Text style={[s.cardPrice, { color: vibe.accentColor }]}>${p.price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={[s.addBtn, { backgroundColor: vibe.accentColor }]}
                  onPress={() => {
                    lightImpact();
                    addItem({ ...p, img: null });
                  }}
                >
                  <Text style={s.addBtnText}>+</Text>
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
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { width: 32 },
  title: { fontSize: 18, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, paddingTop: 16, gap: 12 },
  card: { width: "47%", borderRadius: 16, borderWidth: 1, padding: 12, alignItems: "center" },
  cardIcon: { fontSize: 52, marginBottom: 8 },
  cardWeight: { fontSize: 12, marginBottom: 2, alignSelf: "flex-start" },
  cardName: { fontSize: 14, fontWeight: "600", marginBottom: 8, alignSelf: "flex-start", height: 40 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  cardPrice: { fontSize: 15, fontWeight: "700" },
  addBtn: { borderRadius: 8, width: 30, height: 30, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 20, lineHeight: 22 },
});