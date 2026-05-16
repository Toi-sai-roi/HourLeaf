import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTimeVibe } from '../../hooks/useTimeVibe';
import { getAdminPromos, saveAdminPromo, updateAdminPromo, deleteAdminPromo, AdminPromo } from '../../services/AdminService';
import { Spacing, Radius } from '../../constants/Colors';

export default function AdminPromoScreen() {
  const { vibe } = useTimeVibe();
  const [promos, setPromos] = useState<AdminPromo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPromo, setEditingPromo] = useState<AdminPromo | null>(null);
  const [form, setForm] = useState({ code: '', percent: 0, label: '', minOrder: 0 });

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    const data = await getAdminPromos();
    setPromos(data);
  };

  const handleSave = async () => {
    if (!form.code || !form.percent) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã và % giảm');
      return;
    }

    if (editingPromo) {
      await updateAdminPromo(editingPromo.id, { ...form, active: true });
    } else {
      const newPromo: AdminPromo = {
        id: Date.now().toString(),
        code: form.code.toUpperCase(),
        percent: form.percent,
        label: form.label,
        minOrder: form.minOrder,
        active: true,
      };
      console.log('Saving promo:', newPromo); 
      await saveAdminPromo(newPromo);
    }
    setModalVisible(false);
    setEditingPromo(null);
    setForm({ code: '', percent: 0, label: '', minOrder: 0 });
    loadPromos();
  };

  const handleToggleActive = async (promo: AdminPromo) => {
    await updateAdminPromo(promo.id, { active: !promo.active });
    loadPromos();
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Xác nhận', 'Xóa mã giảm giá này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive', onPress: async () => {
          await deleteAdminPromo(id);
          loadPromos();
        }
      },
    ]);
  };

  const handleEdit = (promo: AdminPromo) => {
    setEditingPromo(promo);
    setForm({ code: promo.code, percent: promo.percent, label: promo.label, minOrder: promo.minOrder });
    setModalVisible(true);
  };

  return (
    <View style={[s.container, { backgroundColor: vibe.backgroundColor }]}>
      <TouchableOpacity style={[s.addBtn, { backgroundColor: vibe.accentColor }]} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={s.addBtnText}>Thêm mã giảm giá</Text>
      </TouchableOpacity>

      <FlatList
        data={promos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[s.promoCard, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor }]}>
            <View style={s.promoHeader}>
              <Text style={[s.promoCode, { color: vibe.accentColor }]}>{item.code}</Text>
              <TouchableOpacity onPress={() => handleToggleActive(item)}>
                <Text style={[s.activeBadge, { color: item.active ? '#10B981' : '#EF4444' }]}>
                  {item.active ? '✅ Đang chạy' : '⏸ Đã dừng'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[s.promoLabel, { color: vibe.textColor }]}>{item.label}</Text>
            <Text style={[s.promoDetail, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Giảm {item.percent}% - Đơn tối thiểu ${item.minOrder}</Text>
            <View style={s.promoActions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Ionicons name="pencil-outline" size={20} color={vibe.accentColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={[s.emptyText, { color: vibe.textColor }]}>Chưa có mã giảm giá nào</Text>}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <ScrollView style={[s.modal, { backgroundColor: vibe.cardBgColor }]} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={[s.modalTitle, { color: vibe.textColor }]}>{editingPromo ? 'Sửa mã' : 'Thêm mã giảm giá'}</Text>
            <TextInput style={[s.input, { borderColor: vibe.borderColor, color: vibe.textColor }]} placeholder="Mã code" placeholderTextColor="#888" value={form.code} onChangeText={(text) => setForm({ ...form, code: text.toUpperCase() })} />
            <TextInput style={[s.input, { borderColor: vibe.borderColor, color: vibe.textColor }]} placeholder="Phần trăm giảm" placeholderTextColor="#888" keyboardType="numeric" value={form.percent.toString()} onChangeText={(text) => setForm({ ...form, percent: parseInt(text) || 0 })} />
            <TextInput style={[s.input, { borderColor: vibe.borderColor, color: vibe.textColor }]} placeholder="Nhãn (VD: Giảm 10%)" placeholderTextColor="#888" value={form.label} onChangeText={(text) => setForm({ ...form, label: text })} />
            <TextInput style={[s.input, { borderColor: vibe.borderColor, color: vibe.textColor }]} placeholder="Đơn hàng tối thiểu ($)" placeholderTextColor="#888" keyboardType="numeric" value={form.minOrder.toString()} onChangeText={(text) => setForm({ ...form, minOrder: parseInt(text) || 0 })} />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => { setModalVisible(false); setEditingPromo(null); setForm({ code: '', percent: 0, label: '', minOrder: 0 }); }}>
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
  promoCard: { padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, marginBottom: 12 },
  promoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  promoCode: { fontSize: 16, fontWeight: '700' },
  activeBadge: { fontSize: 12, fontWeight: '600' },
  promoLabel: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  promoDetail: { fontSize: 12, marginBottom: 8 },
  promoActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 8 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', maxHeight: '80%', borderRadius: Radius.lg, padding: Spacing.lg },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: 15, marginBottom: 12 },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, backgroundColor: '#ccc', borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#333' },
  saveBtn: { flex: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  saveText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});