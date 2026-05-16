import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function OrderFailedScreen() {
  const router = useRouter();
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const angryAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Lắc dữ dội
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 15, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -15, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]),
      { iterations: 4 }
    ).start();

    // Nổi khùng
    Animated.loop(
      Animated.sequence([
        Animated.timing(angryAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(angryAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      { iterations: 3 }
    ).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={['#2B2D42', '#1A1A2E', '#16213E']}
      style={s.container}
    >
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <Animated.View style={{ transform: [{ scale: angryAnim }] }}>
          <View style={[s.iconCircle, { backgroundColor: '#EF444420' }]}>
            <Ionicons name="skull" size={100} color="#EF4444" />
          </View>
        </Animated.View>
      </Animated.View>

      <Text style={[s.title, { color: '#EF4444' }]}>🤬 ERROR 🤬</Text>
      <Text style={[s.sub, { color: '#aaa' }]}>
        Thanh toán thất bại rồi quý anh/ chị ơi!
      </Text>

      <View style={s.buttonGroup}>
        <TouchableOpacity
          style={[s.primaryBtn, { backgroundColor: '#EF4444' }]}
          onPress={() => router.replace('../checkout')}
        >
          <Ionicons name="flash" size={24} color="#fff" />
          <Text style={s.primaryText}>THỬ LẠI NGAY!!!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.secondaryBtn, { borderColor: '#EF4444' }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={[s.secondaryText, { color: '#EF4444' }]}>BỎ QUA, VỀ TRANG CHỦ</Text>
        </TouchableOpacity>
      </View>

      <Text style={[s.helpText, { color: '#EF4444' }]}>
        Hotline 1900 9999 chửi ngay nếu còn tức 🔥
      </Text>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  iconCircle: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 36, fontWeight: '900', textAlign: 'center', marginBottom: 12, letterSpacing: 2 },
  sub: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 40 },
  buttonGroup: { width: '100%', gap: 16, marginBottom: 32 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderRadius: 40, paddingVertical: 16, width: '100%' },
  primaryText: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  secondaryBtn: { borderRadius: 40, paddingVertical: 14, borderWidth: 2, width: '100%', alignItems: 'center' },
  secondaryText: { fontWeight: '800', fontSize: 15 },
  helpText: { fontSize: 14, textAlign: 'center', textDecorationLine: 'underline' },
});