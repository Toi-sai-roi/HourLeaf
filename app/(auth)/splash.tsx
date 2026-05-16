// app/(auth)/splash.tsx
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={s.container}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Text style={s.icon}>🛒✨</Text>
        <Text style={s.title}>Fresh Mart</Text>
        <Text style={s.sub}>Siêu thị tươi ngon mỗi ngày</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4CAF6F', justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 72, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 1, textAlign: 'center' },
  sub: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 8, textAlign: 'center' },
});