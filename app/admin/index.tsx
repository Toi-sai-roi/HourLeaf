// app/admin/index.tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useState, useEffect } from 'react';
import { useTimeVibe } from '../../hooks/useTimeVibe';
import { useCart } from '../../context/CartContext';
import { Spacing, Radius } from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width - 32;

const MENU = [
  { label: 'Mã giảm giá', icon: 'pricetag-outline', route: '/admin/promos', color: '#EF4444' },
  { label: 'Flash Sale', icon: 'flash-outline', route: '/admin/flash-sales', color: '#F59E0B' },
  { label: 'Tag sản phẩm', icon: 'pricetags-outline', route: '/admin/tags', color: '#10B981' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { vibe, effectiveHour } = useTimeVibe();
  const [, setCurrentVibe] = useState(vibe);
  const { allOrders } = useCart();
  const [refreshKey,] = useState(0);


  useEffect(() => {
    setCurrentVibe(vibe);
  }, [effectiveHour, vibe]);
  const successOrders = allOrders.filter(o => o.status !== "Thất bại");
  const totalRevenue = successOrders.reduce((sum, o) => sum + o.total, 0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const revenueByDay = last7Days.map(date => {
    return successOrders
      .filter(o => o.date.split('T')[0] === date)
      .reduce((sum, o) => sum + o.total, 0);
  });

  const productSales: Record<string, { name: string; icon: string; revenue: number; quantity: number }> = {};
  successOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = {
          name: item.name,
          icon: item.icon,
          revenue: 0,
          quantity: 0
        };
      }
      productSales[item.id].revenue += item.price * item.qty;
      productSales[item.id].quantity += item.qty;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  useEffect(() => {
    const loadTotalCustomers = async () => {
      const allUsersRaw = await AsyncStorage.getItem('all_users');
      const allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
      setTotalCustomers(allUsers.length);
    };
    loadTotalCustomers();
  }, []);
  return (
    <ScrollView
      key={refreshKey}
      style={[s.container, { backgroundColor: vibe.backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={s.statsRow}>
        <View style={[s.statCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
          <Text style={[s.statLabel, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Tổng doanh thu</Text>
          <Text style={[s.statValue, { color: vibe.accentColor }]}>${totalRevenue.toFixed(2)}</Text>
        </View>
        <View style={[s.statCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
          <Text style={[s.statLabel, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Đơn hàng thành công</Text>
          <Text style={[s.statValue, { color: vibe.accentColor }]}>{successOrders.length}</Text>
        </View>
        <View style={[s.statCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
          <Text style={[s.statLabel, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Tổng khách hàng</Text>
          <Text style={[s.statValue, { color: vibe.accentColor }]}>{totalCustomers}</Text>
        </View>
      </View>

      <View style={[s.chartCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
        <Text style={[s.chartTitle, { color: vibe.textColor }]}>Doanh thu 7 ngày gần nhất</Text>
        <LineChart
          data={{
            labels: last7Days.map(d => d.slice(5)),
            datasets: [{ data: revenueByDay }]
          }}
          width={screenWidth - 32}
          height={200}
          chartConfig={{
            backgroundColor: vibe.cardBgColor,
            backgroundGradientFrom: vibe.cardBgColor,
            backgroundGradientTo: vibe.cardBgColor,
            decimalPlaces: 0,
            color: () => vibe.accentColor,
            labelColor: () => vibe.textColor === '#1a1a1a' ? '#888' : '#aaa',
            propsForDots: { r: 4, strokeWidth: 2, stroke: vibe.accentColor }
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      <View style={[s.topProductsCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
        <Text style={[s.sectionTitle, { color: vibe.textColor }]}>🏆 Top 5 sản phẩm bán chạy</Text>
        {topProducts.map((item, idx) => (
          <View key={item.name} style={[s.productRow, { borderColor: vibe.borderColor }]}>
            <Text style={[s.productRank, { color: vibe.accentColor }]}>#{idx + 1}</Text>
            <Text style={s.productIcon}>{item.icon}</Text>
            <Text style={[s.productName, { color: vibe.textColor }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[s.productRevenue, { color: vibe.accentColor }]}>${item.revenue.toFixed(2)}</Text>
          </View>
        ))}
        {topProducts.length === 0 && (
          <Text style={[s.emptyText, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Chưa có dữ liệu</Text>
        )}
      </View>

      <View style={s.menuSection}>
        <Text style={[s.menuSectionTitle, { color: vibe.textColor }]}>Quản lý</Text>
        {MENU.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[s.menuCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[s.iconWrap, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text style={[s.menuLabel, { color: vibe.textColor }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  statLabel: { fontSize: 11 },
  chartCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: 20 },
  chartTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  topProductsCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1 },
  productRank: { fontSize: 12, fontWeight: '700', width: 30 },
  productIcon: { fontSize: 24 },
  productName: { flex: 1, fontSize: 13, fontWeight: '500' },
  productRevenue: { fontSize: 13, fontWeight: '700' },
  menuSection: { marginTop: 8 },
  menuSectionTitle: { fontSize: 13, fontWeight: '600', marginBottom: 12, opacity: 0.7 },
  menuCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: 10 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '500', flex: 1 },
  emptyText: { textAlign: 'center', paddingVertical: 20 },
});