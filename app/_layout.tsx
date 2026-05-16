// app/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StatusBar, View } from 'react-native';
import { CartProvider, useCart } from '../context/CartContext';
import { loadCurrentUser } from '../services/StorageService';
import { TimeDemoProvider } from '../context/TimeDemoContext';
import { useTimeVibe } from '../hooks/useTimeVibe';
import { Palette } from '../constants/Colors';
import { VibeController } from '../components/VibeController';
import { AdminProvider } from '@/context/AdminContext';
import { initDefaultPromos } from '../services/AdminService';

// Component để cập nhật StatusBar theo vibe
function StatusBarUpdater() {
  const { vibe } = useTimeVibe();

  useEffect(() => {
    // Cập nhật status bar style theo nền (sáng hay tối)
    const isLightBg = vibe.backgroundColor === '#FDFCF0' || vibe.backgroundColor === '#FFF9E3' || vibe.backgroundColor === '#FFF5E6';
    StatusBar.setBarStyle(isLightBg ? 'dark-content' : 'light-content');
  }, [vibe]);
  
  useEffect(() => {
    initDefaultPromos();
  }, []);
  
  return null;
}

function AppNavigator() {
  const router = useRouter();
  const { setRole, loadUserData } = useCart();
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    (async () => {
      try {
        const user = await loadCurrentUser();
        if (user) {
          setRole(user.role);
          await loadUserData(user.email, user.role);
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/splash');
        }
      } catch {
        router.replace('/(auth)/splash');
      }
    })();
  }, [router, setRole, loadUserData]);

  return (
    <View style={{ flex: 1, backgroundColor: Palette.bg }}>
      <StatusBarUpdater />
      <Stack screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Palette.bg }
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="category/[name]" />
        <Stack.Screen name="search" />
        <Stack.Screen name="filters" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="order-success" />
        <Stack.Screen name="order-failed" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <TimeDemoProvider>
      <CartProvider>
        <AdminProvider>
          <AppNavigator />
        </AdminProvider>
      </CartProvider>
      <VibeController />
    </TimeDemoProvider>
  );
}