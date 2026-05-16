// app/search.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, } from "react-native";
import { ALL_PRODUCTS } from "../constants/products";
import { useCart } from "../context/CartContext";
import { useTimeVibe } from "../hooks/useTimeVibe";
import { Spacing } from "../constants/Colors";
import { useHaptic } from '../hooks/useHaptic';

type SortOption = "default" | "asc" | "desc";

export default function SearchScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const { addItem, filter } = useCart();
  const { vibe } = useTimeVibe();
  const pageAnim = useRef(new Animated.Value(0)).current;
  const { lightImpact } = useHaptic();

  const [sort, setSort] = useState<SortOption>("default");
  const [query, setQuery] = useState(q || "");
  const { cats: selCats, brands: selBrands } = filter;
  const hasFilter = selCats.length > 0 || selBrands.length > 0;

  useEffect(() => {
    if (q) setQuery(q);
    Animated.timing(pageAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [q, pageAnim]);

  const cycleSort = () => {
    setSort((s) =>
      s === "default" ? "asc" : s === "asc" ? "desc" : "default",
    );
  };

  const sortIcon =
    sort === "asc"
      ? "arrow-up"
      : sort === "desc"
        ? "arrow-down"
        : "swap-vertical";
  const sortLabel =
    sort === "asc"
      ? "Giá tăng dần"
      : sort === "desc"
        ? "Giá giảm dần"
        : "Mặc định";

  const results = ALL_PRODUCTS.filter((p) => {
    const matchQuery =
      query.length === 0 || p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat = selCats.length === 0 || selCats.includes(p.category);
    const matchBrand = selBrands.length === 0 || selBrands.includes(p.brand);
    return matchQuery && matchCat && matchBrand;
  }).sort((a, b) =>
    sort === "asc"
      ? a.price - b.price
      : sort === "desc"
        ? b.price - a.price
        : 0,
  );

  const showResults = query.length > 0 || hasFilter;

  return (
    <Animated.View style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: pageAnim }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={vibe.textColor} />
        </TouchableOpacity>
        <View style={[s.searchBox, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
          <Ionicons name="search-outline" size={18} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} />
          <TextInput
            style={[s.input, { color: vibe.textColor }]}
            placeholder="Search Store"
            placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
            value={query}
            onChangeText={setQuery}
            autoFocus={!q}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push("../filters")}>
          <View>
            <Ionicons
              name="options-outline"
              size={24}
              color={hasFilter ? vibe.accentColor : vibe.textColor}
            />
            {hasFilter && <View style={[s.filterDot, { backgroundColor: vibe.accentColor }]} />}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.sortBtn} onPress={cycleSort}>
        <Ionicons
          name={sortIcon as any}
          size={16}
          color={sort !== "default" ? vibe.accentColor : vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'}
        />
        <Text style={[s.sortLabel, { color: sort !== "default" ? vibe.accentColor : vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
          {sortLabel}
        </Text>
      </TouchableOpacity>

      {hasFilter && (
        <View style={s.filterTags}>
          {selCats.map((c) => (
            <View key={c} style={[s.tag, { backgroundColor: vibe.accentColor + '20' }]}>
              <Text style={[s.tagText, { color: vibe.accentColor }]}>{c}</Text>
            </View>
          ))}
          {selBrands.map((b) => (
            <View key={b} style={[s.tag, { backgroundColor: vibe.accentColor + '20' }]}>
              <Text style={[s.tagText, { color: vibe.accentColor }]}>{b}</Text>
            </View>
          ))}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {!showResults && (
          <Text style={[s.hint, { color: vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa' }]}>Start typing to search products...</Text>
        )}
        {showResults && results.length === 0 && (
          <Text style={[s.hint, { color: vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa' }]}>{`No results found for "${query}"`}</Text>
        )}
        <View style={s.grid}>
          {(showResults ? results : []).map((item) => (
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
              <Text style={[s.weight, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>{item.weight}</Text>
              <Text style={[s.name, { color: vibe.textColor }]}>{item.name}</Text>
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
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: 1 },
  input: { flex: 1, fontSize: 14 },
  filterDot: { position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 4 },
  sortBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-end", marginBottom: 12, paddingHorizontal: 4 },
  sortLabel: { fontSize: 13, fontWeight: "500" },
  filterTags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: "600" },
  hint: { textAlign: "center", marginTop: 40, fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "47%", borderWidth: 1, borderRadius: 16, padding: 12, alignItems: "center" },
  icon: { fontSize: 52, marginBottom: 8 },
  weight: { fontSize: 11, marginBottom: 2, alignSelf: "flex-start" },
  name: { fontSize: 13, fontWeight: "600", marginBottom: 8, alignSelf: "flex-start" },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  price: { fontSize: 15, fontWeight: "700" },
  addBtn: { borderRadius: 8, width: 30, height: 30, justifyContent: "center", alignItems: "center" },
});