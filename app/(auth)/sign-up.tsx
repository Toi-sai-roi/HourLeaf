// app/(auth)/sign-up.tsx
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from "react-native";
import { registerAccount } from "../../services/StorageService";
import { useTimeVibe } from "../../hooks/useTimeVibe";
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen() {
  const router = useRouter();
  const { vibe } = useTimeVibe();
  const [username, setUsername] = useState("");
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

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await registerAccount({
        username: username.trim(),
        email: email.trim(),
        password,
        role: "user",
      });
      if (!result.ok) {
        setError(result.msg);
        return;
      }
      router.replace("/(auth)/login");
    } catch {
      setError("Đăng ký thất bại, thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[vibe.backgroundColor, vibe.cardBgColor]} style={s.container}>
      <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, opacity: fadeAnim }}>
        <Text style={[s.title, { color: vibe.textColor }]}>Đăng ký</Text>
        <Text style={[s.sub, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Nhập thông tin để tạo tài khoản</Text>

        <TextInput
          style={[s.input, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
          placeholder="Tên của bạn"
          placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
          value={username}
          onChangeText={(t) => { setUsername(t); setError(""); }}
        />

        <TextInput
          style={[s.input, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
          placeholder="Your Email"
          placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(t) => { setEmail(t); setError(""); }}
        />

        <View style={s.passRow}>
          <TextInput
            style={[s.input, { flex: 1, marginBottom: 0, backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
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

        <Text style={[s.terms, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <Text style={[s.link, { color: vibe.accentColor }]}>Điều khoản dịch vụ</Text> và{" "}
          <Text style={[s.link, { color: vibe.accentColor }]}>Chính sách bảo mật</Text>
        </Text>

        <TouchableOpacity
          style={[s.btn, { backgroundColor: vibe.accentColor }, (!username || !email || !password || loading) && s.btnDisabled]}
          disabled={!username || !email || !password || loading}
          onPress={handleSignup}
        >
          <Text style={s.btnText}>{loading ? "Đang đăng ký..." : "Đăng ký"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={[s.loginLink, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>
            Đã có tài khoản? <Text style={[s.loginBold, { color: vibe.accentColor }]}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  sub: { fontSize: 14, marginBottom: 24 },
  label: { fontSize: 13, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, marginBottom: 16 },
  passRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  eyeBtn: { position: "absolute", right: 16, top: 14 },
  eye: { fontSize: 18 },
  error: { color: "#f44336", fontSize: 13, marginBottom: 8 },
  terms: { fontSize: 12, lineHeight: 18, marginVertical: 16 },
  link: { fontWeight: '600' },
  btn: { borderRadius: 40, paddingVertical: 16, alignItems: "center", marginBottom: 16 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  loginLink: { textAlign: "center", fontSize: 14 },
  loginBold: { fontWeight: "700" },
});