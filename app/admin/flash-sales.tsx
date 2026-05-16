// app/admin/flash-sales.tsx
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
import { useTimeVibe } from '../../hooks/useTimeVibe';
import { getFlashSales, saveFlashSale, updateFlashSale, deleteFlashSale, FlashSale } from '../../services/AdminService';
import { ALL_PRODUCTS } from '../../constants/products';
import { Spacing, Radius } from '../../constants/Colors';

export default function AdminFlashSaleScreen() {
  //   const router = useRouter();
  const { vibe } = useTimeVibe();
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [form, setForm] = useState({ discountPercent: 0, startDate: '', endDate: '' });

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    const data = await getFlashSales();
    setSales(data);
  };

  const handleSave = async () => {
    if (!selectedProductId || !form.discountPercent || !form.startDate || !form.endDate) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const product = ALL_PRODUCTS.find(p => p.id === selectedProductId);
    if (!product) return;

    if (editingSale) {
      await updateFlashSale(editingSale.id, form);
    } else {
      const newSale: FlashSale = {
        id: Date.now().toString(),
        productId: selectedProductId,
        discountPercent: form.discountPercent,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        active: true,
      };
      await saveFlashSale(newSale);
    }
    setModalVisible(false);
    setEditingSale(null);
    setSelectedProductId('');
    setForm({ discountPercent: 0, startDate: '', endDate: '' });
    loadSales();
  };

  const handleToggleActive = async (sale: FlashSale) => {
    await updateFlashSale(sale.id, { active: !sale.active });
    loadSales();
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Xác nhận', 'Xóa chương trình flash sale này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive', onPress: async () => {
          await deleteFlashSale(id);
          loadSales();
        }
      },
    ]);
  };

  //   const getProductName = (productId: string) => {
  //     const product = ALL_PRODUCTS.find(p => p.id === productId);
  //     return product?.name || 'Sản phẩm không tồn tại';
  //   };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <View style={[s.container, { backgroundColor: vibe.backgroundColor }]}>
      <TouchableOpacity style={[s.addBtn, { backgroundColor: vibe.accentColor }]} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={s.addBtnText}>Thêm Flash Sale</Text>
      </TouchableOpacity>

      <FlatList
        data={sales}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const product = ALL_PRODUCTS.find(p => p.id === item.productId);
          return (
            <View style={[s.saleCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
              <View style={s.saleHeader}>
                <View style={s.productInfo}>
                  <Text style={s.productIcon}>{product?.icon}</Text>
                  <Text style={[s.productName, { color: vibe.textColor }]}>{product?.name}</Text>
                </View>
                <TouchableOpacity onPress={() => handleToggleActive(item)}>
                  <Text style={[s.activeBadge, { color: item.active ? '#10B981' : '#EF4444' }]}>
                    {item.active ? '✅ Đang chạy' : '⏸ Đã dừng'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={s.saleBody}>
                <Text style={[s.discount, { color: vibe.accentColor }]}>-{item.discountPercent}%</Text>
                <Text style={[s.dateRange, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
                  {formatDate(item.startDate)} → {formatDate(item.endDate)}
                </Text>
              </View>
              <View style={s.saleActions}>
                <TouchableOpacity onPress={() => {
                  setEditingSale(item);
                  setSelectedProductId(item.productId);
                  setForm({
                    discountPercent: item.discountPercent,
                    startDate: item.startDate.split('T')[0],
                    endDate: item.endDate.split('T')[0],
                  });
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
        ListEmptyComponent={<Text style={[s.emptyText, { color: vibe.textColor }]}>Chưa có chương trình flash sale nào</Text>}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <ScrollView style={[s.modal, { backgroundColor: vibe.cardBgColor }]} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={[s.modalTitle, { color: vibe.textColor }]}>{editingSale ? 'Sửa Flash Sale' : 'Thêm Flash Sale'}</Text>

            <Text style={[s.label, { color: vibe.textColor }]}>Chọn sản phẩm</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.productScroll}>
              {ALL_PRODUCTS.map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={[s.productOption, selectedProductId === product.id && { borderColor: vibe.accentColor, backgroundColor: vibe.accentColor + '20' }]}
                  onPress={() => setSelectedProductId(product.id)}
                >
                  <Text style={s.productOptionIcon}>{product.icon}</Text>
                  <Text style={[s.productOptionName, { color: vibe.textColor }]}>{product.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[s.label, { color: vibe.textColor }]}>Phần trăm giảm</Text>
            <TextInput style={[s.input, { borderColor: vibe.borderColor, color: vibe.textColor }]} placeholder="30" placeholderTextColor="#888" keyboardType="numeric" value={form.discountPercent.toString()} onChangeText={(text) => setForm({ ...form, discountPercent: parseInt(text) || 0 })} />

            <Text style={[s.label, { color: vibe.textColor }]}>Ngày bắt đầu</Text>
            <TextInput style={[s.input, { borderColor: vibe.borderColor, color: vibe.textColor }]} placeholder="2024-01-01" placeholderTextColor="#888" value={form.startDate} onChangeText={(text) => setForm({ ...form, startDate: text })} />

            <Text style={[s.label, { color: vibe.textColor }]}>Ngày kết thúc</Text>
            <TextInput style={[s.input, { borderColor: vibe.borderColor, color: vibe.textColor }]} placeholder="2024-01-07" placeholderTextColor="#888" value={form.endDate} onChangeText={(text) => setForm({ ...form, endDate: text })} />

            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => { setModalVisible(false); setEditingSale(null); setSelectedProductId(''); setForm({ discountPercent: 0, startDate: '', endDate: '' }); }}>
                <Text style={s.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.saveBtn, { backgroundColor: vibe.accentColor }]} onPress={handleSave}>
                <Text style={s.saveText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: Spacing.md, borderRadius: Radius.md, marginBottom: 16 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  saleCard: { padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, marginBottom: 12 },
  saleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  productInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  productIcon: { fontSize: 24 },
  productName: { fontSize: 14, fontWeight: '600' },
  activeBadge: { fontSize: 12, fontWeight: '600' },
  saleBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  discount: { fontSize: 18, fontWeight: '700' },
  dateRange: { fontSize: 12 },
  saleActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 8 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', maxHeight: '80%', borderRadius: Radius.lg, padding: Spacing.lg },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: 15, marginBottom: 12 },
  productScroll: { flexDirection: 'row', marginBottom: 12, maxHeight: 100 },
  productOption: { alignItems: 'center', padding: 8, marginRight: 12, borderRadius: Radius.md, borderWidth: 1, borderColor: 'transparent' },
  productOptionIcon: { fontSize: 32 },
  productOptionName: { fontSize: 10, textAlign: 'center', marginTop: 4 },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, backgroundColor: '#ccc', borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#333' },
  saveBtn: { flex: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  saveText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});