import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '@/store/orderStore';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

type SwapChoice = 'swap' | 'new';

function CylinderIcon({ outline, active }: { outline?: boolean; active?: boolean }) {
  return (
    <View style={[ci.wrap, active && ci.wrapActive]}>
      <View style={[ci.body, outline && ci.bodyOutline, active && ci.bodyActive]}>
        <View style={[ci.dot, outline && ci.dotOutline, active && ci.dotActive]} />
        <View style={[ci.arrow, outline && ci.arrowOutline, active && ci.arrowActive]} />
      </View>
    </View>
  );
}

export default function SwapScreen() {
  const { setSwapDraft } = useOrderStore();
  const [choice, setChoice] = useState<SwapChoice | null>(null);

  function handleSelect(c: SwapChoice) {
    setChoice(c);
    setSwapDraft({ swapType: c });
    // Small delay to show selection feedback, then navigate
    setTimeout(() => router.push('/(main)/swap-details'), 120);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Swap</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>What would you like to do?</Text>
        <Text style={styles.sub}>Swap your one or get a new cylinder</Text>

        <View style={styles.optionRow}>
          {/* Swap Cylinder */}
          <TouchableOpacity
            style={[styles.optionCard, choice === 'swap' && styles.optionCardActive]}
            onPress={() => handleSelect('swap')}
            activeOpacity={0.85}
          >
            <CylinderIcon outline active={choice === 'swap'} />
            <Text style={[styles.optionLabel, choice === 'swap' && styles.optionLabelActive]}>
              Swap Cylinder
            </Text>
          </TouchableOpacity>

          {/* New Cylinder */}
          <TouchableOpacity
            style={[styles.optionCard, choice === 'new' && styles.optionCardActive]}
            onPress={() => handleSelect('new')}
            activeOpacity={0.85}
          >
            <CylinderIcon />
            <Text style={[styles.optionLabel, choice === 'new' && styles.optionLabelActive]}>
              New Cylinder
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ci = StyleSheet.create({
  wrap: { width: 72, height: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, marginBottom: spacing.md },
  wrapActive: { backgroundColor: colors.primaryLight },
  body: { width: 36, height: 52, borderRadius: 8, borderWidth: 2.5, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'space-evenly' },
  bodyOutline: { borderColor: colors.textSecondary },
  bodyActive: { borderColor: colors.primary },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.textSecondary },
  dotOutline: { backgroundColor: colors.textSecondary },
  dotActive: { backgroundColor: colors.primary },
  arrow: { width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 11, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: colors.textSecondary },
  arrowOutline: { borderTopColor: colors.textSecondary },
  arrowActive: { borderTopColor: colors.primary },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 22, color: colors.textPrimary },
  title: { fontSize: fontSize.lg, fontFamily: fontFamily.bold, color: colors.textPrimary },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: 32 },
  heading: { fontSize: fontSize.xl, fontFamily: fontFamily.bold, color: colors.textPrimary, marginBottom: 4 },
  sub: { fontSize: fontSize.base, fontFamily: fontFamily.regular, color: colors.textSecondary, marginBottom: spacing.xxl },
  optionRow: { flexDirection: 'row', gap: spacing.md },
  optionCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.xl, alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  optionCardActive: { borderColor: colors.primary },
  optionLabel: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary, textAlign: 'center' },
  optionLabelActive: { color: colors.textPrimary },
});
