import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

export default function PhoneScreen() {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setPhone = useAuthStore((s) => s.setPhone);

  const formatted = number.replace(/\D/g, '');
  const isValid = formatted.length >= 10;

  async function handleContinue() {
    if (!isValid) { setError('Enter a valid Nigerian number'); return; }
    setError('');
    setLoading(true);
    const phone = '+234' + (formatted.startsWith('0') ? formatted.slice(1) : formatted);
    setPhone(phone);
    await api.sendOtp(phone);
    setLoading(false);
    router.push('/(auth)/otp');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        {/* Logo / Brand */}
        <View style={styles.brandArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🔥</Text>
          </View>
          <Text style={styles.brandName}>RefillX</Text>
          <Text style={styles.tagline}>Gas delivered to your door</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>What's your number?</Text>
          <Text style={styles.sub}>We'll send you a code to verify it's you.</Text>

          <View style={styles.inputRow}>
            <View style={styles.prefix}>
              <Text style={styles.prefixText}>+234</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="800 000 0000"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={number}
              onChangeText={(v) => { setNumber(v); setError(''); }}
              maxLength={11}
              autoFocus
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, !isValid && styles.btnDisabled]}
            onPress={handleContinue}
            disabled={!isValid || loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.btnText}>Continue</Text>
            }
          </TouchableOpacity>

          <Text style={styles.footnote}>
            By continuing you agree to our Terms & Privacy Policy.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
  brandArea: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: { fontSize: 32 },
  brandName: {
    fontSize: fontSize.xxxl, fontFamily: fontFamily.bold,
    color: colors.textPrimary, letterSpacing: -0.5,
  },
  tagline: { fontSize: fontSize.base, fontFamily: fontFamily.regular, color: colors.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  heading: { fontSize: fontSize.xxl, fontFamily: fontFamily.bold, color: colors.textPrimary, marginBottom: 6 },
  sub: { fontSize: fontSize.base, fontFamily: fontFamily.regular, color: colors.textSecondary, marginBottom: spacing.xl },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  prefix: {
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  prefixText: { fontSize: fontSize.base, fontFamily: fontFamily.medium, color: colors.textPrimary },
  input: {
    flex: 1, paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    fontSize: fontSize.base, fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
  error: { fontSize: fontSize.sm, color: colors.error, fontFamily: fontFamily.regular, marginBottom: spacing.md },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.white },
  footnote: {
    fontSize: fontSize.xs, fontFamily: fontFamily.regular,
    color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg,
  },
});
