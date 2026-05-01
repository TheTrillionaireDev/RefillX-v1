import { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '@/store/orderStore';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

export default function ConfirmationScreen() {
  const activeOrder = useOrderStore((s) => s.activeOrder);
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 7 }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const orderNumber = activeOrder?.orderNumber ?? 'RFX00000';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Animated check */}
        <Animated.View style={[styles.checkCircle, { transform: [{ scale }], opacity }]}>
          <Text style={styles.checkMark}>✓</Text>
        </Animated.View>

        <Animated.View style={{ opacity }}>
          <Text style={styles.headline}>Order placed. Your gas is on its way.</Text>
          <Text style={styles.subtext}>
            We've assigned an agent to your order. You'll get an SMS when they're heading to you.
            Sit tight — this won't take long.
          </Text>
        </Animated.View>

        {/* Order Number */}
        <Animated.View style={[styles.orderCard, { opacity }]}>
          <Text style={styles.orderLabel}>Order Number</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
        </Animated.View>

        {/* Track CTA */}
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => router.replace('/(main)/tracking')}
          activeOpacity={0.85}
        >
          <Text style={styles.trackBtnText}>Track My Order</Text>
        </TouchableOpacity>

        {/* Home link */}
        <TouchableOpacity
          style={styles.homeLink}
          onPress={() => router.replace('/(main)')}
        >
          <Text style={styles.homeLinkText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xxl, gap: spacing.xl,
  },
  checkCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#DCFCE7',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  checkMark: { fontSize: 40, color: colors.success },
  headline: {
    fontSize: fontSize.xxl, fontFamily: fontFamily.bold,
    color: colors.textPrimary, textAlign: 'center', lineHeight: 32,
  },
  subtext: {
    fontSize: fontSize.base, fontFamily: fontFamily.regular,
    color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginTop: spacing.sm,
  },
  orderCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.lg,
    width: '100%',
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  orderLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary },
  orderNumber: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary },
  trackBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 16, alignItems: 'center', width: '100%',
  },
  trackBtnText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.white },
  homeLink: { paddingVertical: spacing.sm },
  homeLinkText: { fontSize: fontSize.base, fontFamily: fontFamily.medium, color: colors.textSecondary },
});
