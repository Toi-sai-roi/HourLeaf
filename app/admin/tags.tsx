import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTimeVibe } from '../../hooks/useTimeVibe';
import { getProductTags, saveProductTag, updateProductTag, deleteProductTag, ProductTag } from '../../services/AdminService';
import { ALL_PRODUCTS } from '../../constants/products';
import { Spacing, Radius } from '../../constants/Colors';

const TAG_OPTIONS = [
  { value: 'new', label: '🆕 Mới', color: '#10B981' },
  { value: 'hot', label: '🔥 Hot', color: '#F59E0B' },
  { value: 'sale20', label: '-20%', color: '#EF4444' },
  { value: 'sale30', label: '-30%', color: '#EF4444' },
  { value: 'buy1get1', label: '🔄 Mua 1 tặng 1', color: '#EC4899' },
];

export default function AdminTagsScreen() {
  const router = useRouter();
  const { vibe } = useTimeVibe();
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [, setEditingTag] = useState<ProductTag | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    const data = await getProductTags();
    setTags(data);
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleSave = async () => {
    if (selectedProductIds.length === 0 || !selectedTag) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một sản phẩm và chọn tag');
      return;
    }

    for (const productId of selectedProductIds) {
      const existingTag = tags.find(t => t.productId === productId && t.tag === selectedTag);
      if (existingTag) {
        if (!existingTag.active) {
          await updateProductTag(existingTag.id, { active: true });
        }
      } else {
        const newTag: ProductTag = {
          id: Date.now().toString() + productId,
          productId,
          tag: selectedTag as any,
          active: true,
        };
        await saveProductTag(newTag);
      }
    }
    setModalVisible(false);
    setSelectedProductIds([]);
    setSelectedTag('');
    loadTags();
    router.back();
  };

  const handleToggleActive = async (tag: ProductTag) => {
    await updateProductTag(tag.id, { active: !tag.active });
    loadTags();
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Xác nhận', 'Xóa tag này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive', onPress: async () => {
          await deleteProductTag(id);
          loadTags();
        }
      },
    ]);
  };

  const getProductName = (productId: string) => {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    return product?.name || 'Sản phẩm không tồn tại';
  };

  const getProductIcon = (productId: string) => {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    return product?.icon || '❓';
  };

  const getTagInfo = (tagValue: string) => {
    return TAG_OPTIONS.find(t => t.value === tagValue) || { label: tagValue, color: '#666' };
  };

  return (
    <View style={[s.container, { backgroundColor: vibe.backgroundColor }]}>
      <TouchableOpacity style={[s.addBtn, { backgroundColor: vibe.accentColor }]} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={s.addBtnText}>Gắn tag cho sản phẩm</Text>
      </TouchableOpacity>

      <FlatList
        data={tags}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const tagInfo = getTagInfo(item.tag);
          return (
            <View style={[s.tagCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
              <View style={s.tagHeader}>
                <View style={s.productInfo}>
                  <Text style={s.productIcon}>{getProductIcon(item.productId)}</Text>
                  <Text style={[s.productName, { color: vibe.textColor }]}>{getProductName(item.productId)}</Text>
                </View>
                <TouchableOpacity onPress={() => handleToggleActive(item)}>
                  <Text style={[s.activeBadge, { color: item.active ? '#10B981' : '#EF4444' }]}>
                    {item.active ? '✅ Hiển thị' : '⏸ Ẩn'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={s.tagBody}>
                <View style={[s.tagBadge, { backgroundColor: tagInfo.color + '20' }]}>
                  <Text style={[s.tagText, { color: tagInfo.color }]}>{tagInfo.label}</Text>
                </View>
              </View>
              <View style={s.tagActions}>
                <TouchableOpacity onPress={() => {
                  setEditingTag(item);
                  setSelectedProductIds([item.productId]);
                  setSelectedTag(item.tag);
                  setModalVisible(true);
                }}>
                  <Ionicons name="pencil-outline" size={20} color={vibe.accentColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={[s.emptyText, { color: vibe.textColor }]}>Chưa có tag nào được gắn</Text>}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modal, { backgroundColor: vibe.cardBgColor }]}>
            <Text style={[s.modalTitle, { color: vibe.textColor }]}>Gắn tag cho sản phẩm</Text>

            <View style={s.twoColumnLayout}>
              {/* Cột trái: Danh sách sản phẩm (3 cột) */}
              <View style={s.leftColumn}>
                <Text style={[s.columnTitle, { color: vibe.textColor }]}>Chọn sản phẩm</Text>
                <ScrollView style={{ maxHeight: 400 }}>
                  <View style={s.productGrid}>
                    {ALL_PRODUCTS.map(product => (
                      <TouchableOpacity
                        key={product.id}
                        style={[s.productItem, selectedProductIds.includes(product.id) && { borderColor: vibe.accentColor, backgroundColor: vibe.accentColor + '20' }]}
                        onPress={() => toggleProduct(product.id)}
                      >
                        <View style={s.checkbox}>
                          {selectedProductIds.includes(product.id) && <Ionicons name="checkmark" size={16} color={vibe.accentColor} />}
                        </View>
                        <Text style={s.productItemIcon}>{product.icon}</Text>
                        <Text style={[s.productItemName, { color: vibe.textColor }]} numberOfLines={2}>{product.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Cột phải: Danh sách tag */}
              <View style={s.rightColumn}>
                <Text style={[s.columnTitle, { color: vibe.textColor }]}>Chọn tag</Text>
                <ScrollView style={{ maxHeight: 400 }}>
                  {TAG_OPTIONS.map(tag => (
                    <TouchableOpacity
                      key={tag.value}
                      style={[s.tagItem, selectedTag === tag.value && { borderColor: vibe.accentColor, backgroundColor: vibe.accentColor + '20' }]}
                      onPress={() => setSelectedTag(tag.value)}
                    >
                      <Text style={[s.tagItemText, { color: tag.color }]}>{tag.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => { setModalVisible(false); setSelectedProductIds([]); setSelectedTag(''); }}>
                <Text style={s.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.saveBtn, { backgroundColor: vibe.accentColor }]} onPress={handleSave}>
                <Text style={s.saveText}>Lưu ({selectedProductIds.length} SP)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: Spacing.md, borderRadius: Radius.md, marginBottom: 16 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  tagCard: { padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, marginBottom: 12 },
  tagHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  productInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  productIcon: { fontSize: 24 },
  productName: { fontSize: 14, fontWeight: '600' },
  activeBadge: { fontSize: 12, fontWeight: '600' },
  tagBody: { marginBottom: 8 },
  tagBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 12, fontWeight: '700' },
  tagActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 8 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '95%', maxWidth: 900, borderRadius: Radius.lg, padding: Spacing.lg, maxHeight: '90%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  
  twoColumnLayout: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  leftColumn: { flex: 2 },
  rightColumn: { flex: 1 },
  columnTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  productItem: { width: '25%', marginHorizontal: '1%', alignItems: 'center', padding: 6, borderWidth: 1, borderColor: '#ddd', borderRadius: Radius.md, position: 'relative', marginBottom: 8 },
  checkbox: { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#aaa', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  productItemIcon: { fontSize: 28, marginBottom: 4 },
  productItemName: { fontSize: 10, textAlign: 'center', marginBottom: 4 },

  tagItem: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: Radius.md, borderWidth: 1, borderColor: '#ddd', marginBottom: 8 },
  tagItemText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },

  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, backgroundColor: '#ccc', borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#333' },
  saveBtn: { flex: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  saveText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});