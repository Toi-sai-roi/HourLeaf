// app/(tabs)/favourites.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated, } from "react-native";
import { useCart } from "../../context/CartContext";
import { useTimeVibe } from "../../hooks/useTimeVibe";
import { Spacing } from "../../constants/Colors";
import { useHaptic } from '../../hooks/useHaptic';

export default function FavouritesScreen() {
  const router = useRouter();
  const { favs, toggleFav, addItem } = useCart();
  const { vibe } = useTimeVibe();
  const { mediumImpact } = useHaptic();

  return (
    <Animated.View style={[s.container, { backgroundColor: vibe.backgroundColor }]}>
      <Text style={[s.title, { color: vibe.textColor }]}>Yêu thích</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {favs.length === 0 && (
          <Text style={[s.empty, { color: vibe.textColor }]}>Chưa có mục yêu thích nào 🤍</Text>
        )}
        {favs.map((item, idx) => (
          <View key={item.id} style={[s.item, { borderColor: vibe.borderColor }]}>
            <Text style={{ fontSize: 48, marginRight: 12 }}>{item.icon}</Text>
            <View style={s.info}>
              <Text style={[s.name, { color: vibe.textColor }]}>{item.name}</Text>
              <Text style={[s.volume, { color: vibe.textColor }]}>{item.weight}</Text>
              <Text style={[s.price, { color: vibe.accentColor }]}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFav(item)}>
              <Ionicons name="close" size={20} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {favs.length > 0 && (
        <View style={s.footer}>
          <TouchableOpacity
            style={[s.addAllBtn, { backgroundColor: vibe.accentColor }]}
            onPress={() => {
              mediumImpact(); // ← thêm
              favs.forEach((item) => addItem({ ...item, img: null, }));
              router.push("/(tabs)/cart");
            }}
          >
            <Text style={s.addAllText}>Thêm tất cả vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 52 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  empty: { textAlign: "center", marginTop: 60, fontSize: 14 },

  item: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600" },
  volume: { fontSize: 12, marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "700" },

  footer: { position: "absolute", bottom: 24, left: 16, right: 16 },
  addAllBtn: { borderRadius: 16, paddingVertical: 16, alignItems: "center", width: "100%" },
  addAllText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});