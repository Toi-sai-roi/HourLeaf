// app/(auth)/login.tsx
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from "react-native";
import { useCart } from "../../context/CartContext";
import { loginAccount } from "../../services/StorageService";
import { useTimeVibe } from "../../hooks/useTimeVibe";
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();
  const { setRole, loadUserData } = useCart();
  const { vibe } = useTimeVibe();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await loginAccount(email.trim(), password);
      if (!user) {
        setError("Email hoặc mật khẩu không đúng!");
        return;
      }
      setRole(user.role);
      await loadUserData(user.email, user.role);
      router.replace("/(tabs)/explore");
    } catch {
      setError("Đăng nhập thất bại, thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[vibe.backgroundColor, vibe.cardBgColor]} style={s.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[s.title, { color: vibe.textColor }]}>Đăng nhập</Text>
        <Text style={[s.sub, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Nhập email và mật khẩu</Text>

        <TextInput
          style={[s.input, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
          placeholder="Email"
          placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(t) => { setEmail(t); setError(""); }}
        />

        <View style={s.passRow}>
          <TextInput
            style={[s.input, { flex: 1, backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
            placeholder="Mật khẩu"
            placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
            secureTextEntry={!showPass}
            value={password}
            onChangeText={(t) => { setPassword(t); setError(""); }}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={s.eyeBtn}>
            <Text style={s.eye}>{showPass ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={s.error}>{error}</Text> : null}

        <TouchableOpacity style={s.forgot} onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={[s.forgotText, { color: vibe.accentColor }]}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.btn, { backgroundColor: vibe.accentColor }, (!email || !password || loading) && s.btnDisabled]}
          disabled={!email || !password || loading}
          onPress={handleLogin}
        >
          <Text style={s.btnText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
          <Text style={[s.signupLink, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
            Chưa có tài khoản? <Text style={[s.signupBold, { color: vibe.accentColor }]}>Đăng ký</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 80 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  sub: { fontSize: 14, marginBottom: 32 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, marginBottom: 16 },
  passRow: { flexDirection: "row", alignItems: "center" },
  eyeBtn: { position: "absolute", right: 16, top: 14 },
  eye: { fontSize: 18 },
  error: { color: "#f44336", fontSize: 13, marginBottom: 8 },
  forgot: { alignSelf: "flex-end", marginBottom: 32 },
  forgotText: { fontSize: 13 },
  btn: { borderRadius: 40, paddingVertical: 16, alignItems: "center", marginBottom: 16 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  signupLink: { textAlign: "center", fontSize: 14 },
  signupBold: { fontWeight: "700" },
});