import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const CURRENT_SIZE = '12.5kg';
const SWAP_OPTIONS = [
  { size: '6kg', label: 'Downgrade', diff: -6700 },
  { size: '12.5kg', label: 'Same Size', diff: 0 },
  { size: '25kg', label: 'Upgrade', diff: 12500 },
];

type PayMethod = 'card' | 'bank' | 'cash';

function CylinderIcon({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  const w = size === 'lg' ? 32 : size === 'sm' ? 20 : 26;
  const h = size === 'lg' ? 46 : size === 'sm' ? 30 : 38;
  return (
    <View style={{ width: w, height: h, borderRadius: 6, borderWidth: 2, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'space-evenly' }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textSecondary }} />
      <View style={{ width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: colors.textSecondary }} />
    </View>
  );
}

export default function SwapDetails() {
  const { swapDraft, setSwapDraft, placeOrder, clearDrafts } = useOrderStore();
  const user = useAuthStore((s) => s.user);
  const [selectedSize, setSelectedSize] = useState('12.5kg');
  const [pay, setPay] = useState<PayMethod>('cash');
  const [loading, setLoading] = useState(false);

  const selectedOption = SWAP_OPTIONS.find((o) => o.size === selectedSize);
  const priceDiff = selectedOption?.diff ?? 0;

  async function handlePlaceSwap() {
    setLoading(true);
    const res = await api.placeOrder({ ...swapDraft, paymentMethod: pay });
    setLoading(false);
    if (res.success) {
      placeOrder({
        type: 'swap',
        swapType: swapDraft.swapType ?? 'swap',
        currentSize: CURRENT_SIZE,
        newSize: selectedSize,
        priceDiff,
        cylinderCount: 1,
        address: user?.address ?? '',
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
        <Text style={styles.title}>Swap</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>What would you like to do?</Text>
        <Text style={styles.sub}>Swap your one or get a new cylinder</Text>

        {/* Selected mode badge */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={styles.modeBadgeActive}
            onPress={() => router.back()}
          >
            <View style={styles.cylSmall}><CylinderIcon size="sm" /></View>
            <Text style={styles.modeBadgeLabel}>Swap Cylinder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeBadge} onPress={() => router.back()}>
            <View style={styles.cylSmall}><CylinderIcon size="sm" /></View>
            <Text style={styles.modeBadgeLabelMuted}>New Cylinder</Text>
          </TouchableOpacity>
        </View>

        {/* Swap Details */}
        <Text style={styles.sectionTitle}>Swap Details</Text>
        <Text style={styles.sectionSub}>(based on previous data)</Text>

        <View style={styles.currentCard}>
          <Text style={styles.currentText}>You currently have: <Text style={styles.currentSize}>{CURRENT_SIZE}</Text></Text>
        </View>

        <View style={styles.swapGrid}>
          {SWAP_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.size}
              style={[styles.swapCard, selectedSize === opt.size && styles.swapCardActive]}
              onPress={() => setSelectedSize(opt.size)}
              activeOpacity={0.85}
            >
              <CylinderIcon size="md" />
              <Text style={[styles.swapSize, selectedSize === opt.size && styles.swapSizeActive]}>
                {opt.size}
              </Text>
              <View style={[styles.swapBadge, selectedSize === opt.size && styles.swapBadgeActive]}>
                <Text style={[styles.swapBadgeText, selectedSize === opt.size && styles.swapBadgeTextActive]}>
                  {opt.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Difference */}
        <View style={styles.priceDiffCard}>
          <View style={styles.priceDiffLeft}>
            <View style={styles.priceDiffAccent} />
            <View>
              <Text style={styles.priceDiffLabel}>Price Difference</Text>
              <Text style={styles.priceDiffSub}>{selectedOption?.label}</Text>
            </View>
          </View>
          <Text style={styles.priceDiffValue}>
            {priceDiff === 0 ? '₦0' : priceDiff > 0 ? `+₦${priceDiff.toLocaleString()}` : `-₦${Math.abs(priceDiff).toLocaleString()}`}
          </Text>
        </View>

        {/* Payment */}
        <Text style={styles.sectionTitle2}>Payment Method</Text>
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handlePlaceSwap}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.btnText}>Place Swap</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 22, color: colors.textPrimary },
  title: { fontSize: fontSize.lg, fontFamily: fontFamily.bold, color: colors.textPrimary },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 32 },
  heading: { fontSize: fontSize.xl, fontFamily: fontFamily.bold, color: colors.textPrimary, marginBottom: 4 },
  sub: { fontSize: fontSize.base, fontFamily: fontFamily.regular, color: colors.textSecondary, marginBottom: spacing.xl },

  modeRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  modeBadgeActive: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 1.5, borderColor: colors.primary,
  },
  modeBadge: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 1.5, borderColor: colors.border,
  },
  cylSmall: { opacity: 0.7 },
  modeBadgeLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.bold, color: colors.textPrimary },
  modeBadgeLabelMuted: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.textSecondary },

  sectionTitle: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary },
  sectionSub: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary, marginBottom: spacing.md },
  sectionTitle2: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary, marginBottom: spacing.sm, marginTop: spacing.lg },

  currentCard: {
    backgroundColor: colors.primaryLight, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
  },
  currentText: { fontSize: fontSize.base, fontFamily: fontFamily.medium, color: colors.textPrimary },
  currentSize: { fontFamily: fontFamily.bold },

  swapGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  swapCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, alignItems: 'center', gap: spacing.sm,
    borderWidth: 1.5, borderColor: colors.border,
  },
  swapCardActive: { borderColor: colors.primary },
  swapSize: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary },
  swapSizeActive: { color: colors.textPrimary },
  swapBadge: { backgroundColor: colors.surfaceAlt, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  swapBadgeActive: { backgroundColor: colors.primaryLight },
  swapBadgeText: { fontSize: fontSize.xs, fontFamily: fontFamily.medium, color: colors.textSecondary },
  swapBadgeTextActive: { color: colors.primary },

  priceDiffCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    borderLeftWidth: 4, borderLeftColor: colors.primary, marginBottom: spacing.lg,
  },
  priceDiffLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priceDiffAccent: { width: 0 }, // border-left handles the accent
  priceDiffLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary },
  priceDiffSub: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary },
  priceDiffValue: { fontSize: fontSize.xl, fontFamily: fontFamily.bold, color: colors.primary },

  payLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary, marginBottom: spacing.sm },
  payRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  payOption: {
    paddingHorizontal: spacing.lg, paddingVertical: 12,
    borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  payOptionActive: { borderColor: colors.primary },
  payOptionText: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.textSecondary },
  payOptionTextActive: { color: colors.primary },

  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.md, backgroundColor: colors.background },
  btn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.white },
});
