/* eslint-disable react-hooks/exhaustive-deps */
import { View, Text, StyleSheet, TouchableOpacity, Animated, SectionList } from 'react-native';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useTimeVibe } from '../../hooks/useTimeVibe';
import { Spacing, Radius } from '../../constants/Colors';
import { useHaptic } from '../../hooks/useHaptic';

type TabType = 'all' | 'system' | 'interaction' | 'promo';

const TAB_CONFIG: { key: TabType; label: string; icon: string }[] = [
  { key: 'all', label: 'Tất cả', icon: 'apps-outline' },
  { key: 'system', label: 'Hệ thống', icon: 'server-outline' },
  { key: 'interaction', label: 'Tương tác', icon: 'chatbubble-outline' },
  { key: 'promo', label: 'Ưu đãi', icon: 'gift-outline' },
];

const NEW_NOTIFS = [
  { id: 'new1', type: 'system' as const, icon: '🔔', title: 'Bảo trì hệ thống', body: 'Máy chủ đang bảo trì lúc 22h. Xin lỗi vì sự bất tiện.', time: '2 giờ trước', read: false, cta: 'Xem chi tiết', ctaAction: 'maintenance' },
  { id: 'new2', type: 'interaction' as const, icon: '💬', title: 'Bình luận mới', body: 'Lan đã bình luận vào bài viết của bạn: "Sản phẩm này ngon quá!"', time: '5 giờ trước', read: false, cta: 'Trả lời', ctaAction: 'reply' },
  { id: 'new3', type: 'promo' as const, icon: '🎁', title: 'Flash Sale', body: 'Giảm 30% cho đơn hàng hôm nay! Mã: FLASH30', time: '1 ngày trước', read: true, cta: 'Nhận ngay', ctaAction: 'promo' },
  { id: 'new4', type: 'system' as const, icon: '✅', title: 'Cập nhật thành công', body: 'App đã được cập nhật lên phiên bản mới 2.0.0.', time: '2 ngày trước', read: true, cta: 'Xem chi tiết', ctaAction: 'changelog' },
  { id: 'new5', type: 'interaction' as const, icon: '❤️', title: 'Yêu thích', body: 'Minh đã thích sản phẩm "Bánh mì trắng" của bạn.', time: '3 ngày trước', read: true, cta: 'Xem sản phẩm', ctaAction: 'product' },
  { id: 'new6', type: 'promo' as const, icon: '🎂', title: 'Sinh nhật', body: 'Chúc mừng sinh nhật! Tặng bạn mã giảm 20%', time: '5 ngày trước', read: false, cta: 'Nhận quà', ctaAction: 'birthday' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { vibe } = useTimeVibe();
  const { lightImpact, mediumImpact } = useHaptic();
  const { notifs, updateNotifs, markAllRead: markAllReadContext } = useCart();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const pageAnim = useRef(new Animated.Value(0)).current;
  const tabAnim = useRef(new Animated.Value(0)).current;

  const filteredNotifs = useMemo(() => {
    if (activeTab === 'all') return notifs;
    return notifs.filter(n => n.type === activeTab);
  }, [notifs, activeTab]);
  // Gộp NEW_NOTIFS vào notifs từ context (CHỈ 1 LẦN)
  useEffect(() => {
    const merged = [
      ...notifs,
      ...NEW_NOTIFS.filter(n => !notifs.some(c => c.id === n.id))
    ];
    if (merged.length !== notifs.length) {
      updateNotifs(merged);
    }
  }, [notifs, updateNotifs]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(pageAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(tabAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggleRead = (id: string) => {
    lightImpact();
    const newNotifs = notifs.map(n => n.id === id ? { ...n, read: !n.read } : n);
    updateNotifs(newNotifs);
  };

  const markAllRead = () => {
    lightImpact();
    const newNotifs = notifs.map(n => ({ ...n, read: true }));
    updateNotifs(newNotifs);
    markAllReadContext(); // nếu context có, không thì bỏ
  };

  const deleteSelected = () => {
    mediumImpact();
    const newNotifs = notifs.filter(n => !selectedIds.includes(n.id));
    updateNotifs(newNotifs);
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const handleLongPress = (id: string) => {
    lightImpact();
    setIsSelectMode(true);
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCta = (notif: any) => {
    mediumImpact();
    const newNotifs = notifs.map(n => n.id === notif.id ? { ...n, read: true } : n);
    updateNotifs(newNotifs);
    if (notif.ctaAction === 'promo') {
      router.push('/promo');
    } else if (notif.ctaAction === 'product') {
      router.push('/product/bk1');
    } else {
      alert(`🔔 ${notif.title}\n${notif.body}`);
    }
  };

const sections = useMemo(() => [{ title: '📢 Thông báo mới nhất', data: filteredNotifs }], [filteredNotifs]);  
const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <Animated.View style={[s.container, { backgroundColor: vibe.backgroundColor, opacity: pageAnim  }]}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={[s.title, { color: vibe.textColor }]}>Thông báo</Text>
          {unreadCount > 0 && (
            <View style={[s.headerBadge, { backgroundColor: vibe.accentColor }]}>
              <Text style={s.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={s.headerActions}>
          {isSelectMode ? (
            <>
              <TouchableOpacity onPress={() => { setIsSelectMode(false); setSelectedIds([]); }}>
                <Text style={[s.headerActionText, { color: vibe.accentColor }]}>Huỷ</Text>
              </TouchableOpacity>
              {selectedIds.length > 0 && (
                <TouchableOpacity onPress={deleteSelected} style={{ marginLeft: 16 }}>
                  <Ionicons name="trash-outline" size={22} color={vibe.accentColor} />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={[s.headerActionText, { color: vibe.accentColor }]}>Đọc tất cả</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={s.tabsWrapper}>
        <Animated.View style={[s.tabsContainer, { transform: [{ scale: tabAnim }] }]}>
          {TAB_CONFIG.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[s.tab, activeTab === tab.key && { borderBottomColor: vibe.accentColor, borderBottomWidth: 2 }]}
              onPress={() => { lightImpact(); setActiveTab(tab.key); }}
            >
              <Ionicons name={tab.icon as any} size={18} color={activeTab === tab.key ? vibe.accentColor : vibe.textColor === '#1a1a1a' ? '#888' : '#aaa'} />
              <Text style={[s.tabLabel, { color: activeTab === tab.key ? vibe.accentColor : vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[s.sectionHeader, { color: vibe.accentColor }]}>{title}</Text>
        )}
        renderItem={({ item, index }) => (
          <NotificationCard
            notif={item}
            index={index}
            isSelectMode={isSelectMode}
            isSelected={selectedIds.includes(item.id)}
            onSelect={() => toggleSelect(item.id)}
            onLongPress={() => handleLongPress(item.id)}
            onToggleRead={() => toggleRead(item.id)}
            onCta={() => handleCta(item)}
            vibe={vibe}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }}>
            Không có thông báo nào
          </Text>
        }
      />
    </Animated.View>
  );
}

function NotificationCard({ notif, index, isSelectMode, isSelected, onSelect, onLongPress, onToggleRead, onCta, vibe }: any) {
  const anim = useRef(new Animated.Value(0)).current;
  const getTypeColor = () => {
    switch (notif.type) {
      case 'system': return '#3B82F6';
      case 'interaction': return '#10B981';
      case 'promo': return '#F59E0B';
      default: return vibe.accentColor;
    }
  };
  const getTypeIcon = () => {
    switch (notif.type) {
      case 'system': return '🔧';
      case 'interaction': return '💬';
      case 'promo': return '🏷️';
      default: return '📢';
    }
  };
  const getTypeLabel = () => {
    switch (notif.type) {
      case 'system': return 'Hệ thống';
      case 'interaction': return 'Tương tác';
      case 'promo': return 'Ưu đãi';
      default: return 'Khác';
    }
  };
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 300, delay: index * 60, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onLongPress={onLongPress}
        onPress={() => { if (isSelectMode) onSelect(); else onToggleRead(); }}
        style={[
          s.card,
          { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor },
          !notif.read && { borderLeftColor: getTypeColor(), borderLeftWidth: 4 },
          isSelected && { backgroundColor: vibe.accentColor + '20' }
        ]}
      >
        {isSelectMode && (
          <TouchableOpacity onPress={onSelect} style={s.checkbox}>
            <View style={[s.checkboxBox, isSelected && { backgroundColor: vibe.accentColor, borderColor: vibe.accentColor }]}>
              {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
          </TouchableOpacity>
        )}
        <View style={[s.iconWrapper, { backgroundColor: getTypeColor() + '20' }]}>
          <Text style={s.icon}>{notif.icon}</Text>
        </View>
        <View style={s.content}>
          <View style={s.titleRow}>
            <View style={s.typeBadge}>
              <Text style={s.typeIcon}>{getTypeIcon()}</Text>
              <Text style={[s.typeText, { color: getTypeColor() }]}>{getTypeLabel()}</Text>
            </View>
            {!notif.read && <View style={[s.unreadDot, { backgroundColor: getTypeColor() }]} />}
          </View>
          <Text style={[s.cardTitle, { color: vibe.textColor }]}>{notif.title}</Text>
          <Text style={[s.cardBody, { color: vibe.textColor === '#1a1a1a' ? '#666' : '#aaa' }]} numberOfLines={2}>
            {notif.body}
          </Text>
          <View style={s.footer}>
            <Text style={[s.time, { color: vibe.textColor === '#1a1a1a' ? '#999' : '#aaa' }]}>{notif.time}</Text>
            {!isSelectMode && notif.cta && (
              <TouchableOpacity style={[s.ctaBtn, { backgroundColor: getTypeColor() }]} onPress={onCta}>
                <Text style={s.ctaText}>{notif.cta}</Text>
                <Ionicons name="arrow-forward" size={12} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 52 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 28, fontWeight: '700' },
  headerBadge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  headerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerActionText: { fontSize: 13, fontWeight: '600' },
  tabsWrapper: { marginBottom: 16 },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent', borderRadius: Radius.lg, padding: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: Radius.md, position: 'relative' },
  tabLabel: { fontSize: 13, fontWeight: '600' },
  sectionHeader: { fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  card: { flexDirection: 'row', borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.md, gap: 12 },
  checkbox: { justifyContent: 'center' },
  checkboxBox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  iconWrapper: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 28 },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  typeIcon: { fontSize: 12 },
  typeText: { fontSize: 10, fontWeight: '600' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardBody: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontSize: 11 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  ctaText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});