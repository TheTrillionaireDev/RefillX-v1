import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, NativeSyntheticEvent, TextInputKeyPressEventData,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

function maskPhone(phone: string) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return '+234 ' + digits.slice(3, 6) + ' XXXX ' + digits.slice(-3);
}

export default function OtpScreen() {
  const phone = useAuthStore((s) => s.phone);
  const login = useAuthStore((s) => s.login);
  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  function handleChange(val: string, idx: number) {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = cleaned;
    setDigits(next);
    setError('');
    if (cleaned && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
    if (next.every((d) => d !== '') && cleaned) {
      verify(next.join(''));
    }
  }

  function handleKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>, idx: number) {
    if (e.nativeEvent.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  async function verify(code: string) {
    setLoading(true);
    const res = await api.verifyOtp(phone, code);
    setLoading(false);
    if (res.success && res.user) {
      login({ phone, name: res.user.name, address: res.user.address });
      router.replace('/(main)');
    } else {
      setError('Wrong code — check your SMS and try again.');
      setDigits(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  }

  async function resend() {
    if (countdown > 0) return;
    if (resendCount >= 2) return;
    setResendCount((c) => c + 1);
    setCountdown(RESEND_SECONDS);
    await api.sendOtp(phone);
  }

  const fmt = `${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Enter the code we sent</Text>
        <Text style={styles.sub}>
          Check your SMS — we sent a 4-digit code to{'\n'}
          <Text style={styles.phoneHighlight}>{maskPhone(phone)}</Text>
        </Text>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(r) => { inputRefs.current[i] = r; }}
              style={[styles.box, d && styles.boxFilled, error && styles.boxError]}
              value={d}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.verifying}>Verifying…</Text>
          </View>
        )}

        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <Text style={styles.resendTimer}>Resend code in {fmt}</Text>
          ) : resendCount >= 2 ? (
            <Text style={styles.callUs}>Didn't get it? Call us on 0800-REFILLX</Text>
          ) : (
            <TouchableOpacity onPress={resend}>
              <Text style={styles.resendLink}>Resend code</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  back: { marginBottom: spacing.xxl },
  backText: { fontSize: 24, color: colors.textPrimary },
  heading: { fontSize: fontSize.xxl, fontFamily: fontFamily.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  sub: { fontSize: fontSize.base, fontFamily: fontFamily.regular, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.xxxl },
  phoneHighlight: { color: colors.primary, fontFamily: fontFamily.medium },
  otpRow: { flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-start', marginBottom: spacing.xl },
  box: {
    width: 56, height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    textAlign: 'center',
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  boxFilled: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  boxError: { borderColor: colors.error },
  error: { fontSize: fontSize.sm, color: colors.error, fontFamily: fontFamily.regular, marginBottom: spacing.md },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  verifying: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fontFamily.regular },
  resendRow: { alignItems: 'center', marginTop: spacing.sm },
  resendTimer: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fontFamily.regular },
  resendLink: { fontSize: fontSize.sm, color: colors.primary, fontFamily: fontFamily.medium },
  callUs: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fontFamily.regular, textAlign: 'center' },
});
