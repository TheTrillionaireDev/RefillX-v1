import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function CylinderIcon({ active }: { active?: boolean }) {
  return (
    <View style={[styles.cylIcon, active && styles.cylIconActive]}>
      <View style={styles.cylBody}>
        <View style={[styles.cylDot, active && styles.cylDotActive]} />
        <View style={[styles.cylArrow, active && styles.cylArrowActive]} />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const name = user?.name ?? 'there';
  const address = user?.address ?? 'Set your address';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}, {name}</Text>
          <TouchableOpacity style={styles.bell}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Address Bar */}
        <TouchableOpacity style={styles.addressBar} activeOpacity={0.8}>
          <View style={styles.addressLeft}>
            <Text style={styles.editIcon}>✏️</Text>
            <Text style={styles.addressText} numberOfLines={2}>{address}</Text>
          </View>
          <View style={styles.pinBadge}>
            <Text style={styles.pinIcon}>📍</Text>
          </View>
        </TouchableOpacity>

        {/* Main Action Cards */}
        <View style={styles.actionRow}>
          {/* Refill Card */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(main)/refill')}
            activeOpacity={0.85}
          >
            <CylinderIcon />
            <Text style={styles.actionCardTitle}>Your Cylinder</Text>
            <Text style={styles.actionCardSub}>How full is your gas cylinder?</Text>
            <Text style={styles.actionCardCta}>Order Refill Now</Text>
          </TouchableOpacity>

          {/* Swap Card */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(main)/swap')}
            activeOpacity={0.85}
          >
            <CylinderIcon active />
            <Text style={styles.actionCardTitle}>Need a swap?</Text>
            <Text style={styles.actionCardSub}>Kindly reach out</Text>
            <Text style={styles.actionCardCta}>Swap Now</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickItem}
            onPress={() => router.push('/(main)/tracking')}
          >
            <View style={styles.quickIconWrap}>
              <Text style={styles.quickIcon}>🚚</Text>
            </View>
            <Text style={styles.quickLabel}>Track Order</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem}>
            <View style={styles.quickIconWrap}>
              <Text style={styles.quickIcon}>🎁</Text>
            </View>
            <Text style={styles.quickLabel}>Refer and Earn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem}>
            <View style={styles.quickIconWrap}>
              <Text style={styles.quickIcon}>ℹ️</Text>
            </View>
            <Text style={styles.quickLabel}>About Us</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Tips Banner */}
        <TouchableOpacity style={styles.safetyBanner} activeOpacity={0.9}>
          <View style={styles.safetyLeft}>
            <View style={styles.safetyIconWrap}>
              <Text style={styles.safetyIcon}>🛡️</Text>
            </View>
            <View>
              <Text style={styles.safetyTitle}>Safety Tips</Text>
              <Text style={styles.safetySubtitle}>General knowledge / Safety in the kitchen</Text>
            </View>
          </View>
          <Text style={styles.safetyArrow}>›</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  greeting: { fontSize: fontSize.xxxl, fontFamily: fontFamily.bold, color: colors.textPrimary, flex: 1 },
  bell: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  bellIcon: { fontSize: 18 },

  addressBar: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  addressLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, flex: 1 },
  editIcon: { fontSize: 16, marginTop: 1 },
  addressText: { fontSize: fontSize.base, fontFamily: fontFamily.medium, color: colors.textPrimary, flex: 1 },
  pinBadge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  pinIcon: { fontSize: 18 },

  actionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  actionCardTitle: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.textPrimary, marginTop: spacing.sm },
  actionCardSub: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.sm },
  actionCardCta: { fontSize: fontSize.sm, fontFamily: fontFamily.bold, color: colors.primary },

  cylIcon: {
    width: 40, height: 40, borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  cylIconActive: { backgroundColor: colors.primaryLight },
  cylBody: { width: 20, height: 28, borderRadius: 4, borderWidth: 2, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'space-evenly' },
  cylDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.textSecondary },
  cylDotActive: { backgroundColor: colors.primary },
  cylArrow: { width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: colors.textSecondary },
  cylArrowActive: { borderTopColor: colors.primary },

  quickRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  quickItem: { alignItems: 'center', gap: spacing.sm, flex: 1 },
  quickIconWrap: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  quickIcon: { fontSize: 22 },
  quickLabel: { fontSize: fontSize.xs, fontFamily: fontFamily.medium, color: colors.textPrimary, textAlign: 'center' },

  safetyBanner: {
    backgroundColor: colors.dark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  safetyLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  safetyIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  safetyIcon: { fontSize: 20 },
  safetyTitle: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.white },
  safetySubtitle: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  safetyArrow: { fontSize: 24, color: 'rgba(255,255,255,0.5)', fontFamily: fontFamily.regular },
});
