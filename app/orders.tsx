// app/order.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCart, getOrderStatus } from "../context/CartContext";
import { useTimeVibe } from "../hooks/useTimeVibe";
import { Spacing } from "../constants/Colors";

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useCart();
  const { vibe } = useTimeVibe();
  const pageAnim = useRef(new Animated.Value(0)).current;
  
  const [, setRefreshTrigger] = useState(0); 

  useEffect(() => {
    Animated.timing(pageAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [pageAnim]);

  // Chỉ chạy interval khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }, [])
  );

  const getStatusDisplay = (order: any) => {
    if (order.status === "Thất bại") {
      return { icon: "❌", text: "Thất bại", color: "#EF4444" };
    }
    
    const status = getOrderStatus(order.date);
    switch(status) {
      case "Chờ xác nhận": return { icon: "⏳", text: "Chờ xác nhận", color: "#F59E0B" };
      case "Đang giao": return { icon: "🚚", text: "Đang giao", color: "#3B82F6" };
      case "Đã giao": return { icon: "✅", text: "Đã giao", color: "#10B981" };
      default: return { icon: "📦", text: status, color: "#6B7280" };
    }
  };

  return (
    <Animated.View style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: pageAnim }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={vibe.textColor} />
        </TouchableOpacity>
        <Text style={[s.title, { color: vibe.textColor }]}>Lịch sử đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 48 }}>🛒</Text>
            <Text style={[s.emptyText, { color: vibe.textColor }]}>Chưa có đơn hàng nào</Text>
          </View>
        ) : (
          orders.map((order) => {
            const statusDisplay = getStatusDisplay(order);
            
            return (
              <View key={order.id} style={[s.orderCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
                <View style={s.orderHeader}>
                  <Text style={[s.orderId, { color: vibe.textColor }]}>#{order.id.slice(-5)}</Text>
                  <Text style={[s.orderDate, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>{order.date}</Text>
                  <View style={[s.statusBadge, { backgroundColor: statusDisplay.color + '20' }]}>
                    <Text style={[s.statusText, { color: statusDisplay.color }]}>
                      {statusDisplay.icon} {statusDisplay.text}
                    </Text>
                  </View>
                  <Text style={[s.orderTotal, { color: vibe.accentColor }]}>${order.total.toFixed(2)}</Text>
                </View>

                {order.items.map((item) => (
                  <Text key={item.id} style={[s.orderItem, { color: vibe.textColor === '#1a1a1a' ? '#555' : '#aaa' }]}>
                    {item.icon} {item.name} × {item.qty}
                  </Text>
                ))}

                {order.discount > 0 && (
                  <Text style={[s.savedText, { color: vibe.accentColor }]}>💰 Tiết kiệm ${order.discount.toFixed(2)}</Text>
                )}

                {order.address && (
                  <Text style={[s.addressText, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
                    📍 {order.address.label} — {order.address.detail}
                  </Text>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 52 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "700" },
  empty: { alignItems: "center", marginTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
  orderCard: { borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1 },
  orderHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 6 },
  orderId: { fontSize: 12, fontWeight: "700" },
  orderDate: { fontSize: 12 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: "700" },
  orderTotal: { fontSize: 12, fontWeight: "700" },
  orderItem: { fontSize: 13, paddingVertical: 2 },
  savedText: { fontSize: 11, marginTop: 4 },
  addressText: { fontSize: 11, marginTop: 4 },
});