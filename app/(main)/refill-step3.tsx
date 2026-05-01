import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '@/store/orderStore';
import { api } from '@/services/api';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

type PayMethod = 'card' | 'bank' | 'cash';

function StepBar({ step }: { step: number }) {
  return (
    <View style={sb.row}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={[sb.seg, s <= step && sb.segActive]} />
      ))}
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={bold ? styles.summaryLabelBold : styles.summaryLabel}>{label}</Text>
      <Text style={bold ? styles.summaryValueBold : styles.summaryValue}>{value}</Text>
    </View>
  );
}

export default function RefillStep3() {
  const { refillDraft, placeOrder, clearDrafts } = useOrderStore();
  const [pay, setPay] = useState<PayMethod>('cash');
  const [loading, setLoading] = useState(false);

  const cylinderSize = refillDraft.cylinderSize ?? '';
  const count = refillDraft.cylinderCount ?? 1;
  const gasPrice = refillDraft.gasPrice ?? 0;
  const deliveryFee = refillDraft.deliveryFee ?? 0;
  const handlingFee = refillDraft.handlingFee ?? 0;
  const total = gasPrice + deliveryFee + handlingFee;

  const slotLabel = refillDraft.deliveryMode === 'now'
    ? 'Today | Within 1-2 hours'
    : `Today | ${refillDraft.scheduledSlot ?? ''}`;

  async function handlePlace() {
    setLoading(true);
    const res = await api.placeOrder({ ...refillDraft, paymentMethod: pay });
    setLoading(false);
    if (res.success) {
      placeOrder({
        ...refillDraft,
        type: 'refill',
        cylinderSize,
        cylinderCount: count,
        cylinderCondition: refillDraft.cylinderCondition ?? '',
        customSize: refillDraft.customSize ?? '',
        deliveryMode: refillDraft.deliveryMode ?? 'now',
        scheduledDate: '',
        scheduledSlot: refillDraft.scheduledSlot ?? '',
        address: refillDraft.address ?? '',
        gasPrice,
        deliveryFee,
        handlingFee,
        total,
        paymentMethod: pay,
        orderNumber: res.orderNumber,
        status: 'confirmed',
      });
      clearDrafts();
      router.replace('/(main)/confirmation');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Confirm Order</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.stepLabel}>Step 3 of 3</Text>
        <StepBar step={3} />

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.editLink}>✏️ Edit Order</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <Row label={`${cylinderSize} Refill x ${count}`} value={`₦${gasPrice.toLocaleString()}`} />
          <Row label="Delivery fee" value={`₦${deliveryFee.toLocaleString()}`} />
          <Row label="Handling" value={`₦${handlingFee.toLocaleString()}`} />
          <View style={styles.divider} />
          <Row label="Total" value={`₦${total.toLocaleString()}`} bold />
        </View>

        {/* Pickup Details */}
        <View style={styles.pickupCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Pickup Details</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.editLink}>✏️ Edit Location</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickupRow}>
            <Text style={styles.pickupIcon}>📅</Text>
            <Text style={styles.pickupText}>{slotLabel}</Text>
          </View>
          <View style={styles.pickupRow}>
            <Text style={styles.pickupIcon}>📍</Text>
            <Text style={styles.pickupText}>{refillDraft.address}</Text>
          </View>
        </View>

        {/* Safety Note */}
        <View style={styles.safetyNote}>
          <Text style={styles.safetyIcon}>🛡️</Text>
          <Text style={styles.safetyText}>
            Weight checked. Seal verified. Delivered by a certified agent.
          </Text>
        </View>

        {/* Payment */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text style={styles.payLabel}>Pay with:</Text>
        <View style={styles.payRow}>
          {(['card', 'bank', 'cash'] as PayMethod[]).map((method) => {
            const labels = { card: 'Debit/Credit Card', bank: 'Bank Transfer', cash: 'Cash on Delivery' };
            return (
              <TouchableOpacity
                key={method}
                style={[styles.payOption, pay === method && styles.payOptionActive]}
                onPress={() => setPay(method)}
                activeOpacity={0.85}
              >
                <Text style={[styles.payOptionText, pay === method && styles.payOptionTextActive]}>
                  {labels[method]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.cancelNote}>
          You can cancel before the agent leaves the station.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handlePlace}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.btnText}>Place Order</Text>
          }
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 22, color: colors.textPrimary },
  title: { fontSize: fontSize.lg, fontFamily: fontFamily.bold, color: colors.textPrimary },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 32 },
  stepLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.primary, marginBottom: spacing.sm },
  sectionTitle: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary, marginBottom: spacing.sm, marginTop: spacing.lg },

  summaryCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.lg,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  summaryTitle: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary },
  editLink: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.primary },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  summaryLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary },
  summaryValue: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.textSecondary },
  summaryLabelBold: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary },
  summaryValueBold: { fontSize: fontSize.xl, fontFamily: fontFamily.bold, color: colors.primary },

  pickupCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  pickupRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.sm },
  pickupIcon: { fontSize: 16, marginTop: 1 },
  pickupText: { fontSize: fontSize.base, fontFamily: fontFamily.medium, color: colors.textPrimary, flex: 1 },

  safetyNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.primaryLight, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md,
  },
  safetyIcon: { fontSize: 16 },
  safetyText: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.primary, flex: 1, lineHeight: 20 },

  payLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary, marginBottom: spacing.sm },
  payRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  payOption: {
    paddingHorizontal: spacing.lg, paddingVertical: 12,
    borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  payOptionActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  payOptionText: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.textSecondary },
  payOptionTextActive: { color: colors.primary },

  cancelNote: { fontSize: fontSize.xs, fontFamily: fontFamily.regular, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md },

  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.md, backgroundColor: colors.background },
  btn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.white },
});
