// app/filters.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useTimeVibe } from "../hooks/useTimeVibe";
import { Spacing } from "../constants/Colors";

const CATEGORIES = [
  "fruits",
  "meat",
  "dairy",
  "beverages",
  "bakery",
  "oil",
  "pulses",
  "rice",
];
const CATEGORY_LABELS: Record<string, string> = {
  fruits: "Trái Cây & Rau Củ",
  meat: "Thịt & Cá",
  dairy: "Sữa & Trứng",
  beverages: "Nước uống",
  bakery: "Bánh & Snack",
  oil: "Dầu ăn",
  pulses: "Các loại đậu",
  rice: "Gạo",
};
const BRANDS = ["Individual Collection", "Cocola", "Ifad", "Kazi Farmas"];

export default function FiltersScreen() {
  const router = useRouter();
  const { filter, setFilter } = useCart();
  const { vibe } = useTimeVibe();
  const pageAnim = useRef(new Animated.Value(0)).current;

  const [selCats, setSelCats] = useState<string[]>(filter.cats);
  const [selBrands, setSelBrands] = useState<string[]>(filter.brands);

  useEffect(() => {
    Animated.timing(pageAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [pageAnim]);

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    val: string,
  ) => {
    setList(
      list.includes(val) ? list.filter((i) => i !== val) : [...list, val],
    );
  };

  const apply = () => {
    setFilter({ cats: selCats, brands: selBrands });
    router.back();
  };

  const reset = () => {
    setSelCats([]);
    setSelBrands([]);
  };

  return (
    <Animated.View style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: pageAnim }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={vibe.textColor} />
        </TouchableOpacity>
        <Text style={[s.title, { color: vibe.textColor }]}>Bộ lọc</Text>
        <TouchableOpacity onPress={reset}>
          <Text style={[s.reset, { color: vibe.accentColor }]}>Đặt lại</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[s.sectionTitle, { color: vibe.textColor }]}>Danh mục</Text>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={s.row}
            onPress={() => toggle(selCats, setSelCats, cat)}
          >
            <View style={[s.checkbox, { borderColor: vibe.borderColor }, selCats.includes(cat) && { backgroundColor: vibe.accentColor, borderColor: vibe.accentColor }]}>
              {selCats.includes(cat) && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={[s.rowLabel, { color: vibe.textColor }]}>{CATEGORY_LABELS[cat]}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[s.sectionTitle, { color: vibe.textColor, marginTop: 24 }]}>Thương hiệu</Text>
        {BRANDS.map((brand) => (
          <TouchableOpacity
            key={brand}
            style={s.row}
            onPress={() => toggle(selBrands, setSelBrands, brand)}
          >
            <View style={[s.checkbox, { borderColor: vibe.borderColor }, selBrands.includes(brand) && { backgroundColor: vibe.accentColor, borderColor: vibe.accentColor }]}>
              {selBrands.includes(brand) && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={[s.rowLabel, { color: vibe.textColor }]}>{brand}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={[s.applyBtn, { backgroundColor: vibe.accentColor }]} onPress={apply}>
        <Text style={s.applyText}>
          Áp dụng bộ lọc
          {selCats.length + selBrands.length > 0
            ? ` (${selCats.length + selBrands.length})`
            : ""}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 52 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  title: { fontSize: 18, fontWeight: "700" },
  reset: { fontSize: 13, fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, justifyContent: "center", alignItems: "center" },
  rowLabel: { fontSize: 15 },
  applyBtn: { borderRadius: 16, paddingVertical: 16, alignItems: "center", marginBottom: 32 },
  applyText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});