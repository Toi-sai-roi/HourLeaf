import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTimeDemo } from '../context/TimeDemoContext';
import { getTimeOfDay, timeVibeConfig } from '../constants/timeVibeConfig';
import { useTimeVibe } from '../hooks/useTimeVibe';

export const VibeController = () => {
  const { demoHour, setDemoHour, isDemoMode, setIsDemoMode } = useTimeDemo();
  const [visible, setVisible] = useState(false);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const { timeOfDay } = useTimeVibe();

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };
  const getButtonColor = () => {
    if (isDemoMode) {
      switch (timeOfDay) {
        case 'dawn': return '#D2691E';
        case 'morning': return '#2C7A4A';
        case 'noon': return '#C85C0E';
        case 'afternoon': return '#d2e9e3';
        case 'evening': return '#df8a4d';
        case 'night': return '#6A4E9B';
        case 'lateNight': return '#4A4A6A';
        default: return '#4CAF6F';
      }
    }
    return '#666';
  };

  const getTextColor = () => {
    if (!isDemoMode) return '#fff';
    const brightModes = ['morning', 'noon'];
    return brightModes.includes(timeOfDay) ? '#1A1A1A' : '#fff';
  };
  return (
    <>
      {/* Nút LIVE cố định góc phải trên cùng */}
      <TouchableOpacity
        style={[s.fab, { backgroundColor: getButtonColor() }]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[s.fabText, { color: getTextColor() }]}>
          {isDemoMode ? `${demoHour}h` : 'LIVE'}
        </Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modalContent, { backgroundColor: '#fff' }]}>
            <Text style={s.title}>🛠 Vibe Controller</Text>

            <TouchableOpacity
              style={[s.toggleBtn, isDemoMode && s.toggleBtnActive]}
              onPress={toggleDemoMode}
            >
              <Text style={s.toggleText}>
                {isDemoMode ? "🎭 Chế độ DEMO" : "🌍 Chế độ REAL-TIME"}
              </Text>
            </TouchableOpacity>

            <Text style={s.label}>Chọn giờ để giả lập Vibe:</Text>

            <View style={s.hourGrid}>
              {hours.map((h) => {
                const vibeType = getTimeOfDay(h);
                const isActive = isDemoMode && demoHour === h;
                const accentColor = timeVibeConfig[vibeType]?.accentColor || '#ccc';
                return (
                  <TouchableOpacity
                    key={h}
                    style={[
                      s.hourChip,
                      isActive && { backgroundColor: accentColor, borderColor: accentColor }
                    ]}
                    onPress={() => {
                      if (!isDemoMode) toggleDemoMode();
                      setDemoHour(h);
                    }}
                  >
                    <Text style={[s.hourText, isActive && { color: '#fff' }]}>{h}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={s.closeBtn} onPress={() => setVisible(false)}>
              <Text style={s.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const s = StyleSheet.create({
  fab: { position: 'absolute', top: 10, left: 115, width: 50, height: 50, borderRadius: 22, justifyContent: 'center', alignItems: 'center', zIndex: 9999, opacity: 0},
  fabText: {},

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 450 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#1a1a1a' },

  toggleBtn: { backgroundColor: '#f0f0f0', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  toggleBtnActive: { backgroundColor: '#e8f5e9', borderColor: '#4CAF6F' },
  toggleText: { fontWeight: '700', color: '#333' },

  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 12 },
  hourGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  hourChip: { width: 44, height: 44, backgroundColor: '#f5f5f5', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  hourText: { fontSize: 13, fontWeight: '600', color: '#444' },

  closeBtn: { marginTop: 30, backgroundColor: '#1a1a1a', padding: 14, borderRadius: 14, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});