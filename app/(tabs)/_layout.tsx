// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useCart } from "../../context/CartContext";
import { useTimeVibe } from "../../hooks/useTimeVibe";
import { Palette } from "../../constants/Colors";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, color, size }: { name: IoniconsName; color: string; size: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function CartIcon({ color, size }: { color: string; size: number }) {
  const { count } = useCart();
  const { vibe } = useTimeVibe();
  return (
    <View>
      <Ionicons name="cart-outline" size={size} color={color} />
      {count > 0 && (
        <View style={[s.badge, { backgroundColor: vibe.accentColor }]}>
          <Text style={[s.badgeText, { color: vibe.textColor === '#1a1a1a' ? '#1a1a1a' : '#fff' }]}>
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}
    </View>
  );
}

function NotifIcon({ color, size }: { color: string; size: number }) {
  const { unreadCount } = useCart();
  const { vibe } = useTimeVibe();
  return (
    <View>
      <Ionicons name="notifications-outline" size={size} color={color} />
      {unreadCount > 0 && (
        <View style={[s.badge, { backgroundColor: vibe.accentColor }]}>
          <Text style={[s.badgeText, { color: vibe.textColor === '#1a1a1a' ? '#1a1a1a' : '#fff' }]}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { vibe } = useTimeVibe();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: vibe.accentColor,
        tabBarInactiveTintColor: vibe.textColor === '#1a1a1a' ? '#888' : Palette.textDisabled,
        tabBarStyle: {
          backgroundColor: vibe.cardBgColor,
          borderTopWidth: 1,
          borderTopColor: vibe.borderColor,
          height: 62,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          color: vibe.textColor,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="storefront-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <CartIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifs",
          tabBarIcon: ({ color, size }) => (
            <NotifIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="favourites" options={{ href: null }} />
    </Tabs>
  );
}

const s = StyleSheet.create({
  badge: { position: "absolute", top: -4, right: -8, borderRadius: 999, minWidth: 18, height: 18, justifyContent: "center", alignItems: "center", paddingHorizontal: 4, },
  badgeText: { fontSize: 10, fontWeight: "700", },
});