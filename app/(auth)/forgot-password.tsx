// app/(auth)/forgot_password.tsx
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { loadAccounts, authKeys } from '../../services/StorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTimeVibe } from '../../hooks/useTimeVibe';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { vibe } = useTimeVibe();
  const [email, setEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = async () => {
    setError('');
    if (newPass !== confirmPass) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (newPass.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      const all = await loadAccounts();
      const found = all.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) {
        setError('Email không tồn tại trong hệ thống!');
        return;
      }

      const raw = await AsyncStorage.getItem(authKeys.accounts);
      const registered = raw ? JSON.parse(raw) : [];
      const idx = registered.findIndex(
        (a: any) => a.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (idx < 0) {
        setError('Tài khoản mặc định không thể đổi mật khẩu!');
        return;
      }

      registered[idx].password = newPass;
      await AsyncStorage.setItem(authKeys.accounts, JSON.stringify(registered));
      setSuccess(true);
    } catch {
      setError('Có lỗi xảy ra, thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <LinearGradient colors={[vibe.backgroundColor, vibe.cardBgColor]} style={s.container}>
        <Text style={s.icon}>✅</Text>
        <Text style={[s.title, { color: vibe.textColor }]}>Đổi mật khẩu thành công!</Text>
        <Text style={[s.sub, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Bạn có thể đăng nhập với mật khẩu mới.</Text>
        <TouchableOpacity style={[s.btn, { backgroundColor: vibe.accentColor }]} onPress={() => router.replace('/(auth)/login')}>
          <Text style={s.btnText}>Về đăng nhập</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[vibe.backgroundColor, vibe.cardBgColor]} style={s.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={s.back}>
          <Ionicons name="chevron-back" size={24} color={vibe.accentColor} />
        </TouchableOpacity>

        <Text style={[s.title, { color: vibe.textColor }]}>Quên mật khẩu</Text>
        <Text style={[s.sub, { color: vibe.textColor === '#1a1a1a' ? '#888' : '#aaa' }]}>Nhập email và mật khẩu mới</Text>

        <TextInput
          style={[s.input, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
          placeholder="Email"
          placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(t) => { setEmail(t); setError(''); }}
        />
        <TextInput
          style={[s.input, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
          placeholder="Mật khẩu mới"
          placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
          secureTextEntry
          value={newPass}
          onChangeText={(t) => { setNewPass(t); setError(''); }}
        />
        <TextInput
          style={[s.input, { backgroundColor: vibe.cardBgColor, borderColor: vibe.borderColor, color: vibe.textColor }]}
          placeholder="Xác nhận mật khẩu mới"
          placeholderTextColor={vibe.textColor === '#1a1a1a' ? '#aaa' : '#888'}
          secureTextEntry
          value={confirmPass}
          onChangeText={(t) => { setConfirmPass(t); setError(''); }}
        />

        {error ? <Text style={s.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[s.btn, { backgroundColor: vibe.accentColor }, (!email || !newPass || !confirmPass || loading) && s.btnDisabled]}
          disabled={!email || !newPass || !confirmPass || loading}
          onPress={handleReset}
        >
          <Text style={s.btnText}>{loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  back: { marginBottom: 24 },
  backText: { fontSize: 14 },
  icon: { fontSize: 60, textAlign: 'center', marginBottom: 16, marginTop: 40 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
  sub: { fontSize: 14, marginBottom: 32 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, marginBottom: 16 },
  error: { color: '#f44336', fontSize: 13, marginBottom: 8 },
  btn: { borderRadius: 40, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});