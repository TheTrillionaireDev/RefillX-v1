import { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Linking, Animated, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore, OrderStatus } from '@/store/orderStore';
import { mockAgent } from '@/constants/prices';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'agent_assigned', label: 'Agent Assigned' },
  { key: 'en_route', label: 'En Route' },
  { key: 'arrived', label: 'Arrived' },
];

function StatusBar({ current }: { current: OrderStatus }) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === current);
  return (
    <View style={sb.container}>
      {STATUS_STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <View key={step.key} style={sb.stepWrap}>
            <View style={[sb.dot, done && sb.dotDone, active && sb.dotActive]}>
              {done && <Text style={sb.dotCheck}>✓</Text>}
            </View>
            <Text style={[sb.label, (done || active) && sb.labelActive]} numberOfLines={1}>
              {step.label}
            </Text>
            {i < STATUS_STEPS.length - 1 && (
              <View style={[sb.line, done && sb.lineDone]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

function MapPreview({ agentX }: { agentX: Animated.Value }) {
  return (
    <View style={map.container}>
      <View style={map.road1} />
      <View style={map.road2} />
      {/* User pin */}
      <View style={map.userPin}>
        <View style={map.pinBubble}><Text style={map.pinText}>You</Text></View>
        <View style={map.pinDot} />
      </View>
      {/* Agent pin (animated) */}
      <Animated.View style={[map.agentPin, { left: agentX }]}>
        <View style={map.agentBubble}><Text style={map.agentInitial}>{mockAgent.initial}</Text></View>
      </Animated.View>
    </View>
  );
}

export default function TrackingScreen() {
  const { activeOrder, updateStatus, clearOrder } = useOrderStore();
  const agentX = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    if (!activeOrder) return;
    const statuses: OrderStatus[] = ['agent_assigned', 'en_route', 'arrived'];
    let i = 0;
    const interval = setInterval(() => {
      if (i < statuses.length) {
        updateStatus(statuses[i]);
        if (statuses[i] === 'en_route') {
          Animated.timing(agentX, { toValue: 140, duration: 3000, useNativeDriver: false }).start();
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!activeOrder) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>Nothing in progress.</Text>
          <Text style={styles.emptySubtitle}>Ready to order?</Text>
          <TouchableOpacity style={styles.orderBtn} onPress={() => router.push('/(main)/refill')}>
            <Text style={styles.orderBtnText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const status = activeOrder.status;
  const canCancel = status === 'confirmed' || status === 'agent_assigned';
  const orderNum = activeOrder.orderNumber;
  const isRefill = activeOrder.type === 'refill';
  const itemDesc = isRefill
    ? `1x ${(activeOrder as any).cylinderSize} Refill`
    : `Cylinder Swap → ${(activeOrder as any).newSize}`;
  const totalPaid = activeOrder.type === 'refill'
    ? (activeOrder as any).total
    : Math.abs((activeOrder as any).priceDiff);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Map */}
      <MapPreview agentX={agentX} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Agent card */}
        <View style={styles.agentRow}>
          <View>
            <Text style={styles.agentName}>{mockAgent.name} is on the way</Text>
            <View style={styles.arrivingBadge}>
              <View style={styles.arrivingDot} />
              <Text style={styles.arrivingText}>
                {status === 'arrived' ? 'Arrived' : status === 'en_route' ? 'Arriving soon' : 'Confirmed'}
              </Text>
            </View>
          </View>
          <View style={styles.agentAvatar}>
            <Text style={styles.agentAvatarText}>{mockAgent.initial}</Text>
          </View>
        </View>

        {/* Status bar */}
        <StatusBar current={status} />

        {/* Call button */}
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`tel:${mockAgent.phone}`)}
          activeOpacity={0.85}
        >
          <Text style={styles.callIcon}>📞</Text>
          <Text style={styles.callBtnText}>Call {mockAgent.name}</Text>
        </TouchableOpacity>

        {/* Safety note */}
        <View style={styles.safetyBanner}>
          <Text style={styles.safetyIcon}>🛡️</Text>
          <Text style={styles.safetyText}>
            <Text style={styles.safetyBold}>Safety First: </Text>
            Your cylinder is sealed and verified.
          </Text>
        </View>

        {/* Order Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Order Details</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Order Number</Text>
            <Text style={styles.detailsValue}>#{orderNum}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Items</Text>
            <Text style={styles.detailsValue}>{itemDesc}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Total Paid</Text>
            <Text style={styles.detailsValueBold}>₦{totalPaid.toLocaleString()}</Text>
          </View>
        </View>

        {/* Cancel */}
        {canCancel && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => { clearOrder(); router.replace('/(main)'); }}
          >
            <Text style={styles.cancelBtnText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const sb = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  stepWrap: { flex: 1, alignItems: 'center', position: 'relative' },
  dot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  dotDone: { backgroundColor: colors.success },
  dotActive: { backgroundColor: colors.primary },
  dotCheck: { fontSize: 12, color: colors.white, fontFamily: 'DMSans_700Bold' },
  label: { fontSize: fontSize.xs, fontFamily: 'DMSans_400Regular', color: colors.textMuted, textAlign: 'center' },
  labelActive: { color: colors.textPrimary, fontFamily: 'DMSans_500Medium' },
  line: {
    position: 'absolute', top: 10, left: '55%', right: '-55%',
    height: 2, backgroundColor: colors.border, zIndex: -1,
  },
  lineDone: { backgroundColor: colors.success },
});

const map = StyleSheet.create({
  container: {
    height: 220, backgroundColor: '#E8EDF2',
    overflow: 'hidden', position: 'relative',
  },
  road1: { position: 'absolute', top: '45%', left: 0, right: 0, height: 3, backgroundColor: '#C8D0DA', transform: [{ rotate: '-3deg' }] },
  road2: { position: 'absolute', top: '62%', left: 0, right: 0, height: 2, backgroundColor: '#C8D0DA', transform: [{ rotate: '4deg' }] },
  userPin: { position: 'absolute', top: '30%', left: '55%', alignItems: 'center' },
  pinBubble: { backgroundColor: colors.primary, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 2 },
  pinText: { fontSize: 11, fontFamily: 'DMSans_700Bold', color: colors.white },
  pinDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  agentPin: { position: 'absolute', top: '38%', alignItems: 'center' },
  agentBubble: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, borderWidth: 2.5, borderColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  agentInitial: { fontSize: 16, fontFamily: 'DMSans_700Bold', color: colors.dark },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40, paddingTop: spacing.lg },

  agentRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  agentName: { fontSize: fontSize.xl, fontFamily: fontFamily.bold, color: colors.textPrimary },
  arrivingBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  arrivingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  arrivingText: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.primary },
  agentAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.surfaceAlt, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  agentAvatarText: { fontSize: fontSize.lg, fontFamily: fontFamily.bold, color: colors.textPrimary },

  callBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.success, borderRadius: radius.lg,
    paddingVertical: 14, gap: spacing.sm, marginBottom: spacing.md,
  },
  callIcon: { fontSize: 18 },
  callBtnText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.white },

  safetyBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.dark, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
  },
  safetyIcon: { fontSize: 18 },
  safetyText: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.white, flex: 1, lineHeight: 20 },
  safetyBold: { fontFamily: fontFamily.bold },

  detailsCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  detailsTitle: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary, marginBottom: spacing.md },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailsLabel: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary },
  detailsValue: { fontSize: fontSize.sm, fontFamily: fontFamily.medium, color: colors.textPrimary },
  detailsValueBold: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.primary },

  cancelBtn: {
    borderWidth: 1.5, borderColor: colors.error, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.error },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: spacing.lg },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: fontSize.xxl, fontFamily: fontFamily.bold, color: colors.textPrimary },
  emptySubtitle: { fontSize: fontSize.base, fontFamily: fontFamily.regular, color: colors.textSecondary, marginTop: -spacing.sm },
  orderBtn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 14, paddingHorizontal: spacing.xxxl },
  orderBtnText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.white },
});
