import { View, Text, TouchableOpacity, StyleSheet, Animated,  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// import { useTimeVibe } from '../hooks/useTimeVibe';
import { useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// const { width, height } = Dimensions.get('window');

export default function OrderSuccessScreen() {
  const router = useRouter();
  // const { vibe } = useTimeVibe();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const confetti1 = useRef(new Animated.Value(0)).current;
  const confetti2 = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Vòng quay pháo hoa
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 2000, useNativeDriver: true })
    ).start();

    // Hiệu ứng nổ
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 100, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, friction: 2, tension: 80, useNativeDriver: true }),
      Animated.spring(confetti1, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
      Animated.spring(confetti2, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true, delay: 100 }),
      Animated.timing(rotateAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spinInterpolate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <LinearGradient
      colors={['#FFD166', '#F4A261', '#E76F51']}
      style={s.container}
    >
      <Animated.View style={{ transform: [{ rotate: spinInterpolate }], position: 'absolute', top: 50, left: 20 }}>
        <Text style={{ fontSize: 48 }}>🎉</Text>
      </Animated.View>
      <Animated.View style={{ transform: [{ rotate: spinInterpolate }], position: 'absolute', bottom: 80, right: 20 }}>
        <Text style={{ fontSize: 52 }}>🎊</Text>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: confetti1 }], position: 'absolute', top: '20%', left: '15%' }}>
        <Text style={{ fontSize: 36 }}>✨</Text>
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: confetti2 }], position: 'absolute', bottom: '25%', right: '10%' }}>
        <Text style={{ fontSize: 40 }}>💥</Text>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={[s.iconCircle, { backgroundColor: '#fff' }]}>
          <Ionicons name="checkmark-circle" size={100} color="#E76F51" />
        </View>
      </Animated.View>

      <Animated.Text style={[s.title, { transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }] }]}>
        🎉🔥 ĐẶT HÀNG THÀNH CÔNG 🔥🎉
      </Animated.Text>

      <Animated.Text style={[s.sub, { opacity: bounceAnim }]}>
        Bạn là thần tượng của HourLeaf  hôm nay! 🤩
      </Animated.Text>

      <Animated.View style={[s.buttonGroup, { transform: [{ scale: bounceAnim }] }]}>
        <TouchableOpacity style={[s.primaryBtn, { backgroundColor: '#fff' }]} onPress={() => router.push('/orders')}>
          <Text style={[s.primaryText, { color: '#E76F51' }]}>💥 XEM ĐƠN NGAY 💥</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.secondaryBtn, { borderColor: '#fff' }]} onPress={() => router.replace('/(tabs)')}>
          <Text style={[s.secondaryText, { color: '#fff' }]}>🏃‍♂️ TIẾP TỤC MUA SẮM 🏃‍♀️</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  iconCircle: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  title: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 12, color: '#fff' },
  sub: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 40, color: '#fff' },
  buttonGroup: { marginTop: 20, width: '100%', gap: 16 },
  primaryBtn: { borderRadius: 40, paddingVertical: 16, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  primaryText: { fontWeight: '900', fontSize: 18 },
  secondaryBtn: { borderRadius: 40, paddingVertical: 16, borderWidth: 2, width: '100%', alignItems: 'center' },
  secondaryText: { fontWeight: '800', fontSize: 16 },
});