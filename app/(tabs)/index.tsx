import { ScrollView, StyleSheet, View, Animated, TextInput, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTimeVibe } from '../../hooks/useTimeVibe';
import { TimeAwareHeader } from '../../components/TimeAwareHeader';
import { DailyRitualCard } from '../../components/DailyRitualCard';
import { ProductGrid } from '../../components/ProductGrid';
import { FlashSaleCard } from '../../components/FlashSaleCard';
import { useCart } from '../../context/CartContext';
import { ALL_PRODUCTS } from '../../constants/products';
import { Radius, Spacing } from '../../constants/Colors';
import { LiveDealBanner } from '../../components/LiveDealBanner';
import { VibeOfferCard } from '../../components/VibeOfferCard';
import { useHaptic } from '../../hooks/useHaptic';
import { getProductTags, ProductTag } from '../../services/AdminService';
// Ảnh nền theo từng khung giờ
const bgImages = {
  dawn: require('../../assets/bg/dawn.png'),
  morning: require('../../assets/bg/morning.png'),
  noon: require('../../assets/bg/noon.png'),
  afternoon: require('../../assets/bg/afternoon.png'),
  evening: require('../../assets/bg/evening.png'),
  night: require('../../assets/bg/night.png'),
  lateNight: require('../../assets/bg/lateNight.png'),
};
// Ảnh banner theo từng khung giờ 
const heroImages = {
  dawn: require('../../assets/index/dawn_index.png'),
  morning: require('../../assets/index/morning_index.png'),
  noon: require('../../assets/index/noon_index.png'),
  afternoon: require('../../assets/index/afternoon_index.png'),
  evening: require('../../assets/index/evening_index.png'),
  night: require('../../assets/index/night_index.png'),
};
function HomeScreenContent() {
  const router = useRouter();
  const { addItem } = useCart();
  const { timeOfDay } = useTimeVibe();
  const pageAnim = useRef(new Animated.Value(0)).current;
  const [searchText, setSearchText] = useState('');
  const { lightImpact } = useHaptic();
  const [productTags, setProductTags] = useState<ProductTag[]>([]);

  useEffect(() => {
    Animated.timing(pageAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (searchText.trim()) router.push({ pathname: '/search', params: { q: searchText.trim() } });
  };

  const exclusiveProducts = ALL_PRODUCTS.filter(p => p.tags?.includes('exclusive')).slice(0, 4);
  const bestSellingProducts = ALL_PRODUCTS.filter(p => p.tags?.includes('bestselling')).slice(0, 4);
  const suggestions = ALL_PRODUCTS.slice(0, 6);

  return (
    <ImageBackground
      source={bgImages[timeOfDay] || bgImages.morning}
      style={s.bgImage}
      imageStyle={{ resizeMode: 'cover' }}
      resizeMode="cover"
    >
      <Animated.ScrollView
        style={[s.container, { opacity: pageAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <TimeAwareHeader />

        {/* Search Box */}
        <View style={s.searchBox}>
          <Ionicons name="search-outline" size={18} color="#aaa" />
          <TextInput
            placeholder="Tìm kiếm đồ ăn, thức uống..."
            placeholderTextColor="#aaa"
            style={s.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Banner */}
        {timeOfDay === 'lateNight' ? (
          <View style={s.lateNightBanner}>
            <Text style={s.lateNightText}>🥱 Khuya rồi, ngủ đi mai mua tiếp nhé! 😴💤</Text>
          </View>
        ) : (
          <Image source={heroImages[timeOfDay]} style={s.heroImage} resizeMode="cover" />
        )}

        {/* Exclusive Offer */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>🔥 Ưu đãi độc quyền</Text>
          <TouchableOpacity onPress={() => router.push('/section/exclusive')}>
            <Text style={s.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.horizontalRow}>
          {exclusiveProducts.map((product) => {
            const dynamicTag = getTagForProduct(product.id);
            const badge = dynamicTag || null;
            return (
              <TouchableOpacity key={product.id} style={s.horizontalCard} onPress={() => router.push(`/product/${product.id}`)}>
                {badge && (
                  <View style={[s.badgeHorizontal, badge.style]}>
                    <Text style={s.badgeText}>{badge.text}</Text>
                  </View>
                )}
                <Text style={s.horizontalIcon}>{product.icon}</Text>
                <Text style={s.horizontalName}>{product.name}</Text>
                <Text style={s.horizontalWeight}>{product.weight}</Text>
                <View style={s.horizontalFooter}>
                  <Text style={s.horizontalPrice}>${product.price.toFixed(2)}</Text>
                  <TouchableOpacity style={s.horizontalAdd} onPress={() => { lightImpact(); addItem({ ...product, img: null }); }}>
                    <Text style={s.horizontalAddText}>+</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Gợi ý hôm nay */}
        <ProductGrid
          products={suggestions}
          title="📦 GỢI Ý HÔM NAY"
          columns={2}
          textColor="#fff"
          cardBgColor="rgba(0,0,0,0.6)"
          borderColor="rgba(255,255,255,0.2)"
          accentColor="#D4AF37"
        />

        {/* Best Selling */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>⭐ Sản phẩm bán chạy</Text>
          <TouchableOpacity onPress={() => router.push('/section/bestselling')}>
            <Text style={s.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.horizontalRow}>
          {bestSellingProducts.map((product) => {
            const dynamicTag = getTagForProduct(product.id);
            const badge = dynamicTag || null;
            return (
              <TouchableOpacity key={product.id} style={s.horizontalCard} onPress={() => router.push(`/product/${product.id}`)}>
                {badge && (
                  <View style={[s.badgeHorizontal, badge.style]}>
                    <Text style={s.badgeText}>{badge.text}</Text>
                  </View>
                )}
                <Text style={s.horizontalIcon}>{product.icon}</Text>
                <Text style={s.horizontalName}>{product.name}</Text>
                <Text style={s.horizontalWeight}>{product.weight}</Text>
                <View style={s.horizontalFooter}>
                  <Text style={s.horizontalPrice}>${product.price.toFixed(2)}</Text>
                  <TouchableOpacity style={s.horizontalAdd} onPress={() => { lightImpact(); addItem({ ...product, img: null }); }}>
                    <Text style={s.horizontalAddText}>+</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <LiveDealBanner />
        <VibeOfferCard />
        <DailyRitualCard />
        <FlashSaleCard />
      </Animated.ScrollView>
    </ImageBackground>
  );
}

export default function HomeScreen() {
  return <HomeScreenContent />;
}

const s = StyleSheet.create({
  bgImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 44 },
  badgeHorizontal: { position: 'absolute', top: 0, left: 0, paddingHorizontal: 6, paddingVertical: 3, borderBottomRightRadius: 8, borderTopLeftRadius: 14, zIndex: 10 },
  badgeNew: { backgroundColor: '#10B981' },
  badgeHot: { backgroundColor: '#F59E0B' },
  badgeSale: { backgroundColor: '#EF4444' },
  badgeBuy1Get1: { backgroundColor: '#EC4899' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, gap: 10, marginBottom: Spacing.lg, marginTop: 4 },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },

  hero: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: Radius.lg, padding: 16, marginBottom: 24, alignItems: 'center' },
  lateNightBanner: { backgroundColor: '#1b2b57', padding: 20, borderRadius: 20, marginBottom: 16, alignItems: 'center' },
  lateNightText: { fontSize: 16, fontWeight: '600', color: '#aae7d6', textAlign: 'center' },
  heroImage: { width: '100%', height: 160, borderRadius: 20, marginBottom: 16 },
  heroTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  heroSub: { fontSize: 13, color: '#fff', opacity: 0.9 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  seeAll: { fontSize: 13, fontWeight: '500', color: '#D4AF37' },

  horizontalRow: { marginBottom: Spacing.sm },
  horizontalCard: { width: 140, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: Radius.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', padding: Spacing.md, marginRight: Spacing.md, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  horizontalIcon: { fontSize: 48, marginBottom: Spacing.sm },
  horizontalName: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 2, color: '#fff' },
  horizontalWeight: { fontSize: 11, marginBottom: Spacing.sm, color: '#ccc' },
  horizontalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  horizontalPrice: { fontSize: 14, fontWeight: '700', color: '#D4AF37' },
  horizontalAdd: { backgroundColor: '#D4AF37', borderRadius: Radius.sm, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  horizontalAddText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});