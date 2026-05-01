import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { deliveryFees } from '@/constants/prices';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

function StepBar({ step }: { step: number }) {
  return (
    <View style={sb.row}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={[sb.seg, s <= step && sb.segActive]} />
      ))}
    </View>
  );
}

function MapPreview() {
  return (
    <View style={map.container}>
      <View style={map.road1} />
      <View style={map.road2} />
      <View style={map.pin}>
        <View style={map.pinBubble}><Text style={map.pinText}>You</Text></View>
        <View style={map.pinDot} />
      </View>
    </View>
  );
}

export default function RefillStep2() {
  const { refillDraft, setRefillDraft } = useOrderStore();
  const user = useAuthStore((s) => s.user);
  const [mode, setMode] = useState<'now' | 'schedule'>(refillDraft.deliveryMode ?? 'now');
  const [scheduledSlot, setScheduledSlot] = useState(refillDraft.scheduledSlot ?? '');
  const address = user?.address ?? 'Set your address';

  const canContinue = mode === 'now' || (mode === 'schedule' && !!scheduledSlot);
  const fee = mode === 'now' ? deliveryFees.express : deliveryFees.scheduled;

  function handleContinue() {
    if (!canContinue) return;
    setRefillDraft({
      deliveryMode: mode,
      scheduledSlot,
      address,
      deliveryFee: fee,
      total: (refillDraft.gasPrice ?? 0) + fee + (refillDraft.handlingFee ?? 0),
    });
    router.push('/(main)/refill-step3');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pickup Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.stepLabel}>Step 2 of 3</Text>
        <StepBar step={2} />

        {/* Address */}
        <Text style={styles.sectionTitle}>Pickup Address</Text>
        <View style={styles.addressCard}>
          <Text style={styles.pinIcon}>📍</Text>
          <View style={styles.addressInfo}>
            <Text style={styles.addressText}>{address}</Text>
          </View>
        </View>
        <TouchableOpacity><Text style={styles.changeLink}>Change Address</Text></TouchableOpacity>

        {/* Map Preview */}
        <Text style={styles.sectionTitle}>Map Preview</Text>
        <MapPreview />

        {/* Pickup Time */}
        <Text style={styles.sectionTitle}>Pickup Time</Text>

        <TouchableOpacity
          style={[styles.timeCard, mode === 'now' && styles.timeCardActive]}
          onPress={() => setMode('now')}
          activeOpacity={0.85}
        >
          <View style={styles.timeCardLeft}>
            <Text style={styles.timeCardTitle}>Now:</Text>
            <Text style={styles.timeCardSub}> Within 1-2 hours</Text>
          </View>
          <View style={[styles.radio, mode === 'now' && styles.radioActive]}>
            {mode === 'now' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timeCard, mode === 'schedule' && styles.timeCardActive]}
          onPress={() => setMode('schedule')}
          activeOpacity={0.85}
        >
          <View style={styles.timeCardLeft}>
            <Text style={styles.timeCardTitle}>Schedule:</Text>
            <Text style={styles.timeCardSub}> Choose a date & time</Text>
          </View>
          <View style={[styles.radio, mode === 'schedule' && styles.radioActive]}>
            {mode === 'schedule' && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        {mode === 'schedule' && (
          <View style={styles.slotPicker}>
            {['Morning slot (8am–12pm)', 'Afternoon slot (12pm–4pm)', 'Evening slot (4pm–8pm)'].map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotItem, scheduledSlot === slot && styles.slotItemActive]}
                onPress={() => setScheduledSlot(slot)}
              >
                <Text style={[styles.slotText, scheduledSlot === slot && styles.slotTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, !canContinue && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const sb = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, marginBottom: spacing.xl },
  seg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  segActive: { backgroundColor: colors.primary },
});

const map = StyleSheet.create({
  container: {
    height: 140, backgroundColor: '#E8EDF2',
    borderRadius: radius.lg, marginBottom: spacing.lg,
    overflow: 'hidden', position: 'relative',
  },
  road1: {
    position: 'absolute', top: '40%', left: 0, right: 0,
    height: 3, backgroundColor: '#C8D0DA', transform: [{ rotate: '-5deg' }],
  },
  road2: {
    position: 'absolute', top: '60%', left: 0, right: 0,
    height: 2, backgroundColor: '#C8D0DA', transform: [{ rotate: '3deg' }],
  },
  pin: { position: 'absolute', top: '30%', left: '40%', alignItems: 'center' },
  pinBubble: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: 8, paddingVertical: 3, marginBottom: 2,
  },
  pinText: { fontSize: fontSize.xs, fontFamily: fontFamily.bold, color: colors.white },
  pinDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 22, color: colors.textPrimary },
  title: { fontSize: fontSize.lg, fontFamily: fontFamily.bold, color: colors.textPrimary },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 32 },
  stepLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.primary, marginBottom: spacing.sm },
  sectionTitle: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.lg },

  addressCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  pinIcon: { fontSize: 18, marginTop: 1 },
  addressInfo: { flex: 1 },
  addressText: { fontSize: fontSize.base, fontFamily: fontFamily.medium, color: colors.textPrimary },
  changeLink: { fontSize: fontSize.sm, fontFamily: fontFamily.bold, color: colors.primary, marginBottom: spacing.md },

  timeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 1.5, borderColor: colors.border, marginBottom: spacing.md,
  },
  timeCardActive: { borderColor: colors.primary },
  timeCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  timeCardTitle: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary },
  timeCardSub: { fontSize: fontSize.base, fontFamily: fontFamily.regular, color: colors.textSecondary },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },

  slotPicker: { marginTop: -spacing.sm, marginBottom: spacing.lg },
  slotItem: {
    padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surface, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  slotItemActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  slotText: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.textSecondary },
  slotTextActive: { color: colors.primary },

  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.md, backgroundColor: colors.background },
  btn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.white },
});
