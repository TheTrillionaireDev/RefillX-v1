import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '@/store/orderStore';
import { gasPrices, cylinderSizes, handlingFee } from '@/constants/prices';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const SIZES = ['2kg', '4kg', '6kg', '12.5kg'];

function StepBar({ step }: { step: number }) {
  return (
    <View style={sb.row}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={[sb.seg, s <= step && sb.segActive]} />
      ))}
    </View>
  );
}

function CylinderSvg({ active }: { active?: boolean }) {
  return (
    <View style={[cyl.wrap, active && cyl.wrapActive]}>
      <View style={[cyl.body, active && cyl.bodyActive]}>
        <View style={[cyl.dot, active && cyl.dotActive]} />
        <View style={[cyl.arrow, active && cyl.arrowActive]} />
      </View>
    </View>
  );
}

export default function RefillStep1() {
  const { refillDraft, setRefillDraft } = useOrderStore();
  const [size, setSize] = useState(refillDraft.cylinderSize ?? '');
  const [count, setCount] = useState(refillDraft.cylinderCount ?? 1);
  const [condition, setCondition] = useState(refillDraft.cylinderCondition ?? '');
  const [customSize, setCustomSize] = useState(refillDraft.customSize ?? '');

  const activeSize = size || customSize;
  const price = activeSize ? (gasPrices[activeSize] ?? 0) : 0;
  const total = price * count + handlingFee;

  function handleContinue() {
    if (!activeSize) return;
    setRefillDraft({
      type: 'refill',
      cylinderSize: activeSize,
      cylinderCount: count,
      cylinderCondition: condition,
      customSize,
      gasPrice: price * count,
      handlingFee,
      total,
    });
    router.push('/(main)/refill-step2');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Book a Refill</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.stepLabel}>Step 1 of 3</Text>
        <StepBar step={1} />

        {/* Cylinder Size */}
        <Text style={styles.sectionTitle}>Select cylinder size</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeScroll}>
          <View style={styles.sizeRow}>
            {SIZES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.sizeCard, size === s && styles.sizeCardActive]}
                onPress={() => { setSize(s); setCustomSize(''); }}
                activeOpacity={0.8}
              >
                <CylinderSvg active={size === s} />
                <Text style={[styles.sizeLabel, size === s && styles.sizeLabelActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.customLabel}>Kg not found? Enter your kg here:</Text>
        <TextInput
          style={[styles.customInput, customSize && styles.customInputActive]}
          placeholder="3Kg"
          placeholderTextColor={colors.textMuted}
          value={customSize}
          onChangeText={(v) => { setCustomSize(v); setSize(''); }}
          keyboardType="decimal-pad"
        />

        {/* Cylinder Count */}
        <Text style={styles.sectionTitle}>How many cylinders?</Text>
        <View style={styles.countRow}>
          <View style={styles.counter}>
            <TouchableOpacity
              style={styles.countBtn}
              onPress={() => setCount(Math.max(1, count - 1))}
            >
              <Text style={styles.countBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countValue}>{count}</Text>
            <TouchableOpacity
              style={styles.countBtn}
              onPress={() => setCount(Math.min(3, count + 1))}
            >
              <Text style={styles.countBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.countNote}>Max 3 cylinders per order</Text>
        </View>

        {/* Condition */}
        <Text style={styles.sectionTitle}>Cylinder condition <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.conditionInput}
          placeholder="Any dents, rust, damage or note?"
          placeholderTextColor={colors.textMuted}
          value={condition}
          onChangeText={setCondition}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        {activeSize ? (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₦{total.toLocaleString()}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={[styles.btn, !activeSize && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={!activeSize}
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

const cyl = StyleSheet.create({
  wrap: { width: 48, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.sm },
  wrapActive: { backgroundColor: colors.primaryLight },
  body: { width: 24, height: 36, borderRadius: 5, borderWidth: 2, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'space-evenly' },
  bodyActive: { borderColor: colors.primary },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.textSecondary },
  dotActive: { backgroundColor: colors.primary },
  arrow: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: colors.textSecondary },
  arrowActive: { borderTopColor: colors.primary },
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
  optional: { fontFamily: fontFamily.regular, color: colors.textSecondary },

  sizeScroll: { marginHorizontal: -spacing.xl, paddingHorizontal: spacing.xl },
  sizeRow: { flexDirection: 'row', gap: spacing.md, paddingRight: spacing.xl },
  sizeCard: {
    width: 80, borderRadius: radius.lg,
    backgroundColor: colors.surface, padding: spacing.md,
    alignItems: 'center', gap: spacing.sm,
    borderWidth: 1.5, borderColor: colors.border,
  },
  sizeCardActive: { borderColor: colors.primary, backgroundColor: colors.surface },
  sizeLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.textSecondary },
  sizeLabelActive: { color: colors.textPrimary, fontFamily: fontFamily.bold },

  customLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.sm },
  customInput: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, paddingVertical: 14,
    fontSize: fontSize.base, fontFamily: fontFamily.regular,
    color: colors.textPrimary, borderWidth: 1.5, borderColor: colors.border, width: 120,
  },
  customInputActive: { borderColor: colors.primary },

  countRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  counter: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  countBtn: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  countBtnText: { fontSize: fontSize.lg, fontFamily: fontFamily.bold, color: colors.textPrimary },
  countValue: { fontSize: fontSize.xl, fontFamily: fontFamily.bold, color: colors.textPrimary, minWidth: 28, textAlign: 'center' },
  countNote: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary },

  conditionInput: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.lg, fontSize: fontSize.base,
    fontFamily: fontFamily.regular, color: colors.textPrimary,
    borderWidth: 1.5, borderColor: colors.border, minHeight: 90,
  },

  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.md, backgroundColor: colors.background },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  priceLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary },
  priceValue: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary },
  btn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.white },
});
