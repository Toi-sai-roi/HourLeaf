import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { PRODUCTS_MAP, ALL_PRODUCTS } from "../../constants/products";
import { useCart } from "../../context/CartContext";
import { useTimeVibe } from "../../hooks/useTimeVibe";
import { useHaptic } from "../../hooks/useHaptic";
import { Radius, Spacing } from "../../constants/Colors";
import { getFlashSales } from "../../services/AdminService";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { vibe, effectiveHour } = useTimeVibe();
  const { lightImpact, mediumImpact } = useHaptic();
  const pageAnim = useRef(new Animated.Value(0)).current;

  const [qty, setQty] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [newStars, setNewStars] = useState(5);
  const [newComment, setNewComment] = useState("");
  const { addItem, toggleFav, isFav, addReview, getReviews } = useCart();
  const [flashDiscount, setFlashDiscount] = useState(0);

  useEffect(() => {
    Animated.timing(pageAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [pageAnim]);

  // Kiểm tra flash sale cho sản phẩm này
  useEffect(() => {
    const checkFlashSale = async () => {
      const sales = await getFlashSales();
      const now = new Date();
      const activeSale = sales.find(s => 
        s.productId === id && 
        s.active && 
        new Date(s.startDate) <= now && 
        new Date(s.endDate) >= now
      );
      
      if (activeSale) {
        let discount = 0;
        if (effectiveHour >= 17 && effectiveHour < 20) discount = 10;
        if (effectiveHour >= 21 && effectiveHour < 23) discount = 30;
        setFlashDiscount(discount);
      } else {
        setFlashDiscount(0);
      }
    };
    checkFlashSale();
  }, [id, effectiveHour]);

  const product = PRODUCTS_MAP[id] ?? PRODUCTS_MAP["1"];
  const finalPrice = flashDiscount > 0 
    ? product.price * (1 - flashDiscount / 100) 
    : product.price;

  const relatedProducts = ALL_PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 6);

  const productReviews = getReviews(id);
  const avgStars = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.stars, 0) / productReviews.length
    : 0;

  const [soldToday] = useState(() => Math.floor(Math.random() * 200) + 50);

  const handleAddReview = () => {
    if (!newComment.trim()) return;
    lightImpact();
    addReview({
      productId: id,
      author: "Bạn",
      stars: newStars,
      comment: newComment.trim(),
    });
    setNewComment("");
    setNewStars(5);
  };

  const increaseQty = () => {
    lightImpact();
    setQty(prev => prev + 1);
  };

  const decreaseQty = () => {
    lightImpact();
    if (qty > 1) setQty(prev => prev - 1);
  };

  const handleAddToCart = () => {
    mediumImpact();
    // Thêm sản phẩm với giá đã giảm (nếu có flash sale)
    const itemToAdd = { ...product, price: finalPrice, img:null };
    addItem(itemToAdd, qty);
    router.push("/(tabs)/cart");
  };

  return (
    <Animated.View style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: pageAnim }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={vibe.textColor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            lightImpact();
            toggleFav({
              id,
              name: product.name,
              weight: product.weight,
              price: product.price,
              icon: product.icon,
            });
          }}
        >
          <Ionicons
            name={isFav(id) ? "heart" : "heart-outline"}
            size={24}
            color={isFav(id) ? "#f44336" : vibe.textColor}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={s.iconContainer}>
          <Text style={s.productIcon}>{product.icon}</Text>
          {flashDiscount > 0 && (
            <View style={[s.discountBadge, { backgroundColor: vibe.accentColor }]}>
              <Text style={s.discountText}>-{flashDiscount}%</Text>
            </View>
          )}
        </View>

        <View style={s.info}>
          <View style={s.nameRow}>
            <Text style={[s.name, { color: vibe.textColor }]}>{product.name}</Text>
            <Text style={[s.weight, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>{product.weight}</Text>
          </View>

          <View style={s.statsRow}>
            <View style={s.rating}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={[s.ratingText, { color: vibe.textColor }]}>{avgStars.toFixed(1)}</Text>
              <Text style={[s.reviewCount, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
                ({productReviews.length} đánh giá)
              </Text>
            </View>
            <Text style={[s.soldText, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
              📈 {soldToday}+ đã bán hôm nay
            </Text>
          </View>

          {/* Price with flash sale */}
          <View style={s.priceRow}>
            {flashDiscount > 0 ? (
              <>
                <Text style={[s.oldPrice, { color: vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa' }]}>
                  ${product.price.toFixed(2)}
                </Text>
                <Text style={[s.price, { color: vibe.accentColor }]}>${finalPrice.toFixed(2)}</Text>
              </>
            ) : (
              <Text style={[s.price, { color: vibe.accentColor }]}>${product.price.toFixed(2)}</Text>
            )}
          </View>

          <View style={s.qtySection}>
            <Text style={[s.qtyLabel, { color: vibe.textColor }]}>Số lượng</Text>
            <View style={s.qtyRow}>
              <TouchableOpacity style={[s.qtyBtn, { borderColor: vibe.borderColor }]} onPress={decreaseQty}>
                <Text style={[s.qtyBtnText, { color: vibe.textColor }]}>-</Text>
              </TouchableOpacity>
              <Text style={[s.qtyValue, { color: vibe.textColor }]}>{qty}</Text>
              <TouchableOpacity style={[s.qtyBtn, { borderColor: vibe.borderColor }]} onPress={increaseQty}>
                <Text style={[s.qtyBtnText, { color: vibe.textColor }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[s.infoSection, { borderColor: vibe.borderColor }]}>
            <Text style={[s.infoTitle, { color: vibe.textColor }]}>Thông tin sản phẩm</Text>
            <View style={s.infoRow}>
              <Text style={[s.infoLabel, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Xuất xứ:</Text>
              <Text style={[s.infoValue, { color: vibe.textColor }]}>{product.brand === "Kazi Farmas" ? "Việt Nam" : "Nhập khẩu"}</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={[s.infoLabel, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Bảo quản:</Text>
              <Text style={[s.infoValue, { color: vibe.textColor }]}>Nơi khô ráo, thoáng mát</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={[s.infoLabel, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>HSD:</Text>
              <Text style={[s.infoValue, { color: vibe.textColor }]}>Xem trên bao bì sản phẩm</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[s.sectionRow, { borderColor: vibe.borderColor }]}
            onPress={() => setShowDetail(!showDetail)}
          >
            <Text style={[s.sectionTitle, { color: vibe.textColor }]}>Chi tiết sản phẩm</Text>
            <Ionicons name={showDetail ? "chevron-up" : "chevron-down"} size={18} color={vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa'} />
          </TouchableOpacity>
          {showDetail && <Text style={[s.detailText, { color: vibe.textColor === '#1a1a1a' ? '#555' : '#aaa' }]}>{product.detail}</Text>}

          {product.nutrition && (
            <View style={[s.nutritionRow, { borderColor: vibe.borderColor }]}>
              <Text style={[s.sectionTitle, { color: vibe.textColor }]}>Dinh dưỡng</Text>
              <View style={s.nutritionBadge}>
                <Text style={[s.nutritionText, { color: vibe.accentColor }]}>
                  🔥 {product.nutrition.calories} • 🧈 {product.nutrition.fat} • 🥩 {product.nutrition.protein}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[s.sectionRow, { borderColor: vibe.borderColor }]}
            onPress={() => setShowReview(!showReview)}
          >
            <Text style={[s.sectionTitle, { color: vibe.textColor }]}>Đánh giá</Text>
            <View style={s.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name={i <= Math.round(avgStars) ? "star" : "star-outline"} size={14} color="#FFC107" />
              ))}
            </View>
            <Text style={[s.reviewCount, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
              ({productReviews.length})
            </Text>
            <Ionicons name={showReview ? "chevron-up" : "chevron-down"} size={18} color={vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa'} />
          </TouchableOpacity>

          {showReview && (
            <View style={s.reviewSection}>
              {productReviews.length === 0 && (
                <Text style={[s.noReview, { color: vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa' }]}>Chưa có đánh giá nào.</Text>
              )}
              {productReviews.map((r) => (
                <View key={r.id} style={[s.reviewCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
                  <View style={s.reviewHeader}>
                    <Text style={[s.reviewAuthor, { color: vibe.textColor }]}>{r.author}</Text>
                    <View style={s.stars}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Ionicons key={i} name={i <= r.stars ? "star" : "star-outline"} size={12} color="#FFC107" />
                      ))}
                    </View>
                    <Text style={[s.reviewDate, { color: vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa' }]}>{r.date}</Text>
                  </View>
                  <Text style={[s.reviewComment, { color: vibe.textColor === '#1a1a1a' ? '#555' : '#aaa' }]}>{r.comment}</Text>
                </View>
              ))}

              <View style={[s.reviewForm, { borderColor: vibe.borderColor }]}>
                <Text style={[s.formTitle, { color: vibe.textColor }]}>Viết đánh giá</Text>
                <View style={s.starPicker}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TouchableOpacity key={i} onPress={() => setNewStars(i)}>
                      <Ionicons name={i <= newStars ? "star" : "star-outline"} size={28} color="#FFC107" />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={[s.input, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
                  placeholder="Nhận xét của bạn..."
                  placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#aaa'}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity style={[s.submitBtn, { backgroundColor: vibe.accentColor }]} onPress={handleAddReview}>
                  <Text style={s.submitText}>Gửi đánh giá</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {relatedProducts.length > 0 && (
            <View style={s.relatedSection}>
              <Text style={[s.relatedTitle, { color: vibe.textColor }]}>✨ Có thể bạn thích</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.relatedList}>
                {relatedProducts.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[s.relatedItem, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}
                    onPress={() => {
                      lightImpact();
                      router.push(`/product/${item.id}`);
                    }}
                  >
                    <Text style={s.relatedIcon}>{item.icon}</Text>
                    <Text style={[s.relatedName, { color: vibe.textColor }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[s.relatedPrice, { color: vibe.accentColor }]}>${item.price.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={[s.addBtn, { backgroundColor: vibe.accentColor }]} onPress={handleAddToCart}>
          <Text style={s.addBtnText}>Thêm vào giỏ • ${(finalPrice * qty).toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: 8 },
  iconBtn: { padding: 4 },
  iconContainer: { alignItems: "center", marginVertical: 16, position: "relative" },
  productIcon: { fontSize: 100, textAlign: "center" },
  discountBadge: { position: "absolute", top: 0, right: 30, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  discountText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  info: { paddingHorizontal: Spacing.lg },
  nameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  name: { fontSize: 20, fontWeight: "700", flex: 1 },
  weight: { fontSize: 13 },

  statsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  rating: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 13, fontWeight: "600" },
  reviewCount: { fontSize: 12 },
  soldText: { fontSize: 12 },

  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 },
  price: { fontSize: 24, fontWeight: "700" },
  oldPrice: { fontSize: 16, textDecorationLine: "line-through" },

  qtySection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' },
  qtyLabel: { fontSize: 15, fontWeight: "600" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  qtyBtn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  qtyBtnText: { fontSize: 20, fontWeight: "600" },
  qtyValue: { fontSize: 16, fontWeight: "600", minWidth: 30, textAlign: "center" },

  infoSection: { borderTopWidth: 1, paddingTop: 12, marginBottom: 12 },
  infoTitle: { fontSize: 15, fontWeight: "600", marginBottom: 8 },
  infoRow: { flexDirection: "row", marginBottom: 6 },
  infoLabel: { width: 80, fontSize: 13 },
  infoValue: { flex: 1, fontSize: 13 },

  sectionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderTopWidth: 1, gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: "600", flex: 1 },
  detailText: { fontSize: 13, lineHeight: 20, marginBottom: 12 },

  nutritionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderTopWidth: 1, justifyContent: "space-between" },
  nutritionBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  nutritionText: { fontSize: 12, fontWeight: "500" },

  stars: { flexDirection: "row", gap: 2 },

  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: Spacing.lg, paddingBottom: 32, paddingTop: 8, backgroundColor: "transparent" },
  addBtn: { borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  reviewSection: { marginBottom: 16 },
  noReview: { fontSize: 13, textAlign: "center", paddingVertical: 12 },
  reviewCard: { borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1 },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  reviewAuthor: { fontSize: 13, fontWeight: "600" },
  reviewDate: { fontSize: 11, marginLeft: "auto" },
  reviewComment: { fontSize: 13, lineHeight: 18 },

  reviewForm: { borderTopWidth: 1, paddingTop: 16, marginTop: 8 },
  formTitle: { fontSize: 14, fontWeight: "600", marginBottom: 10 },
  starPicker: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 13, minHeight: 70, textAlignVertical: "top", marginBottom: 10 },
  submitBtn: { borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  relatedSection: { marginTop: 16, marginBottom: 24 },
  relatedTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  relatedList: { flexDirection: "row" },
  relatedItem: { alignItems: "center", marginRight: Spacing.md, padding: Spacing.sm, borderRadius: Radius.md, borderWidth: 1, width: 90 },
  relatedIcon: { fontSize: 40, marginBottom: 4 },
  relatedName: { fontSize: 11, textAlign: "center", marginBottom: 2 },
  relatedPrice: { fontSize: 11, fontWeight: "600", textAlign: "center" },
});