// app/admin/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useTimeVibe } from '../../hooks/useTimeVibe';
import { TimeDemoProvider } from '../../context/TimeDemoContext';

export default function AdminLayout() {
  const router = useRouter();
  const { role } = useCart();
  const { vibe } = useTimeVibe();

  useEffect(() => {
    if (role !== 'admin') {
      router.replace('/(tabs)');
    }
  }, [role, router]);

  if (role !== 'admin') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: vibe.backgroundColor }}>
        <Text style={{ color: vibe.textColor }}>Bạn không có quyền truy cập trang này</Text>
      </View>
    );
  }

  return (
    <TimeDemoProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: 'Quay lại',
          headerStyle: { backgroundColor: vibe.cardBgColor },
          headerTintColor: vibe.textColor,
          headerTitleStyle: { fontWeight: '600', color: vibe.textColor },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
        <Stack.Screen name="promos" options={{ title: 'Quản lý mã giảm giá' }} />
        <Stack.Screen name="flash-sales" options={{ title: 'Quản lý Flash Sale' }} />
        <Stack.Screen name="tags" options={{ title: 'Quản lý Tag sản phẩm' }} />
      </Stack>
    </TimeDemoProvider>
  );
}