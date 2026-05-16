// app/(tabs)/explore.tsx
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, ScrollView, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTimeVibe } from '../../hooks/useTimeVibe';
import { ALL_PRODUCTS } from '../../constants/products';
import { Palette, Radius, Spacing } from '../../constants/Colors';
import { useHaptic } from '../../hooks/useHaptic';
import { useCart } from '../../context/CartContext';
import { getProductTags, ProductTag } from '../../services/AdminService';

const CATEGORIES = [
  { id: 'fruits', name: 'Trái Cây', icon: '🍎', bg: '#FF6B6B80' },
  { id: 'meat', name: 'Thịt Cá', icon: '🥩', bg: '#F4A26180' },
  { id: 'dairy', name: 'Trứng Sữa', icon: '🥛', bg: '#E9C46A80' },
  { id: 'beverages', name: 'Đồ Uống', icon: '🧃', bg: '#39c8b780' },
  { id: 'bakery', name: 'Bánh Kẹo', icon: '🍞', bg: '#E76F5180' },
  { id: 'oil', name: 'Dầu Ăn', icon: '🫒', bg: '#56d87f80' },
  { id: 'pulses', name: 'Đậu Các Loại', icon: '🫘', bg: '#ae6f3380' },
  { id: 'rice', name: 'Gạo Các Loại', icon: '🍚', bg: '#BCAAA480' },
  { id: 'kitchen', name: 'Dụng Cụ', icon: '🔪', bg: '#a678cf80' },
];

const TRENDING_PRODUCTS = [
  ALL_PRODUCTS.find(p => p.id === 'm1'),
  ALL_PRODUCTS.find(p => p.id === 'bv4'),
  ALL_PRODUCTS.find(p => p.id === 'm2'),
  ALL_PRODUCTS.find(p => p.id === '7'),
].filter(Boolean);

const MOST_SEARCHED = [
  ALL_PRODUCTS.find(p => p.id === 'bk1'),
  ALL_PRODUCTS.find(p => p.id === 'd1'),
  ALL_PRODUCTS.find(p => p.id === 'b1'),
  ALL_PRODUCTS.find(p => p.id === 'fv1'),
].filter(Boolean);

export default function ExploreScreen() {
  const router = useRouter();
  const { vibe } = useTimeVibe();
  const { addItem } = useCart();
  const { lightImpact } = useHaptic();
  const [searchText, setSearchText] = useState('');
  const pageAnim = useRef(new Animated.Value(0)).current;
  const [productTags, setProductTags] = useState<ProductTag[]>([]);

  useEffect(() => {
    Animated.timing(pageAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [pageAnim]);

  useEffect(() => {
    const loadTags = async () => {
      const tags = await getProductTags();
      setProductTags(tags.filter(t => t.active));
    };
    loadTags();
  }, []);

  const getTagForProduct = (productId: string) => {
    const tag = productTags.find(t => t.productId === productId);
    if (!tag) return null;

    switch (tag.tag) {
      case 'new': return { text: '🆕 Mới', style: s.badgeNew };
      case 'hot': return { text: '🔥 Hot', style: s.badgeHot };
      case 'sale20': return { text: '-20%', style: s.badgeSale };
      case 'sale30': return { text: '-30%', style: s.badgeSale };
      case 'buy1get1': return { text: '🔄 Mua 1 tặng 1', style: s.badgeBuy1Get1 };
      default: return null;
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push({ pathname: '/search', params: { q: searchText } });
    }
  };

  return (
    <Animated.ScrollView
      style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: pageAnim }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={[s.title, { color: vibe.textColor }]}>Khám phá</Text>

      <View style={[s.searchBox, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
        <Ionicons name="search-outline" size={20} color={vibe.textColor === '#1a1a1a' ? '#999' : Palette.textDisabled} />
        <TextInput
          placeholder="Tìm kiếm sản phẩm, thương hiệu..."
          placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : Palette.textDisabled}
          style={[s.searchInput, { color: vibe.textColor }]}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color={vibe.textColor === '#1a1a1a' ? '#999' : Palette.textDisabled} />
          </TouchableOpacity>
        )}
      </View>

      {/* Banner */}
      <TouchableOpacity
        style={[s.banner, { borderColor: vibe.accentColor }]}
        onPress={() => router.push('/promo')}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../assets/images/5.png')}
          style={s.bannerImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Text style={[s.sectionTitle, { color: vibe.textColor }]}>Danh mục</Text>
      <View style={s.categoriesGrid}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[s.categoryCard, { backgroundColor: cat.bg, borderColor: vibe.borderColor }]}
            onPress={() => router.push(`/category/${cat.id}`)}
          >
            <Text style={s.categoryIcon}>{cat.icon}</Text>
            <Text style={[s.categoryName, { color: vibe.textColor }]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trending ngay bây giờ */}
      <Text style={[s.sectionTitle, { color: vibe.textColor }]}>⚡ Thịnh hành</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.horizontalList}>
        {TRENDING_PRODUCTS.map((product, idx) => {
          const dynamicTag = product ? getTagForProduct(product.id) : null;
          return (
            <TouchableOpacity
              key={product?.id}
              style={[s.trendingCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, position: 'relative' }]}
              onPress={() => router.push(`/product/${product?.id}`)}
            >
              {dynamicTag && (
                <View style={[s.badgeTrending, dynamicTag.style]}>
                  <Text style={s.badgeText}>{dynamicTag.text}</Text>
                </View>
              )}
              <Text style={s.trendingRank}>#{idx + 1}</Text>
              <Text style={s.trendingIcon}>{product?.icon}</Text>
              <Text style={[s.trendingName, { color: vibe.textColor }]} numberOfLines={1}>{product?.name}</Text>
              <TouchableOpacity
                style={[s.trendingAdd, { backgroundColor: vibe.accentColor + '20' }]}
                onPress={(e) => {
                  e.stopPropagation();
                  lightImpact();
                  if (product) addItem({ ...product, img: null });
                }}
              >
                <Ionicons name="add" size={18} color={vibe.accentColor} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Được tìm kiếm nhiều */}
      <Text style={[s.sectionTitle, { color: vibe.textColor }]}>🔍 Được tìm kiếm nhiều</Text>
      <View style={s.mostSearchedGrid}>
        {MOST_SEARCHED.map((product, idx) => {
          const dynamicTag = product ? getTagForProduct(product?.id) : null;
          return (
            <TouchableOpacity
              key={product?.id}
              style={[s.searchedCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, position: 'relative' }]}
              onPress={() => router.push(`/product/${product?.id}`)}
            >
              {dynamicTag && (
                <View style={[s.badgeSearched, dynamicTag.style]}>
                  <Text style={s.badgeText}>{dynamicTag.text}</Text>
                </View>
              )}
              <Text style={s.searchedIcon}>{product?.icon}</Text>
              <View style={s.searchedInfo}>
                <Text style={[s.searchedName, { color: vibe.textColor }]}>{product?.name}</Text>
                <Text style={[s.searchedWeight, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>{product?.weight}</Text>
              </View>
              <TouchableOpacity
                style={[s.searchedAdd, { backgroundColor: vibe.accentColor }]}
                onPress={(e) => {
                  e.stopPropagation();
                  lightImpact();
                  if (product) addItem({ ...product, img: null });
                }}
              >
                <Ionicons name="add" size={16} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 52 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },

  // Search
  searchBox: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 12, gap: 10, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 15 },

  // Banner & CTA
  banner: { borderRadius: 20, borderWidth: 1, marginBottom: 24, overflow: 'hidden', position: 'relative', height: 220 },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerOverlay: { width: '100%', height: '100%', position: 'absolute' },
  bannerGradient: { padding: 20, width: '100%', minHeight: 160, position: 'relative' },
  bannerIcons: { position: 'absolute', right: 16, bottom: 16, flexDirection: 'row', gap: 10 },


  // Sections Common
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14, marginTop: 8 },

  // Categories
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24, gap: 8 },
  categoryCard: { width: '23%', borderRadius: Radius.lg, borderWidth: 1, paddingVertical: Spacing.md, alignItems: 'center', justifyContent: 'center', minHeight: 80 },
  categoryIcon: { fontSize: 28, marginBottom: 6 },
  categoryName: { fontSize: 10, fontWeight: '500', textAlign: 'center' },

  // Trending
  horizontalList: { marginBottom: 24 },
  trendingCard: { width: 110, borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.sm, marginRight: Spacing.md, alignItems: 'center', position: 'relative' },
  trendingRank: { position: 'absolute', top: 6, left: 8, fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  trendingIcon: { fontSize: 40, marginBottom: 6, marginTop: 12 },
  trendingName: { fontSize: 11, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  trendingAdd: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },

  // Most Searched
  mostSearchedGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 24 },
  searchedCard: { width: '48%', borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 8, position: 'relative' },
  searchedIcon: { fontSize: 32 },
  searchedInfo: { flex: 1 },
  searchedName: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  searchedWeight: { fontSize: 10 },
  searchedAdd: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },

  // Badges
  badgeTrending: { position: 'absolute', top: -4, left: -4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, zIndex: 10 },
  badgeSearched: { position: 'absolute', top: -4, left: -4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, zIndex: 10 },
  badgeNew: { backgroundColor: '#10B981' },
  badgeHot: { backgroundColor: '#F59E0B' },
  badgeSale: { backgroundColor: '#EF4444' },
  badgeBuy1Get1: { backgroundColor: '#EC4899' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});