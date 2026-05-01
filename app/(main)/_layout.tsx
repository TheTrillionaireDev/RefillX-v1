import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, fontFamily, fontSize } from '@/constants/theme';

function HomeIcon({ focused }: { focused: boolean }) {
  const c = focused ? colors.primary : colors.textSecondary;
  return (
    <View style={ti.wrap}>
      {/* Simple house outline */}
      <View style={[ti.houseRoof, { borderBottomColor: c }]} />
      <View style={[ti.houseBody, { borderColor: c }]}>
        <View style={[ti.houseDoor, { borderColor: c }]} />
      </View>
      <Text style={[ti.label, { color: c }]}>Home</Text>
    </View>
  );
}

function RefillIcon({ focused }: { focused: boolean }) {
  const c = focused ? colors.primary : colors.textSecondary;
  return (
    <View style={ti.wrap}>
      <View style={[ti.drop, { borderColor: c }]}>
        <View style={[ti.dropTip, { borderTopColor: c }]} />
      </View>
      <Text style={[ti.label, { color: c }]}>Refill</Text>
    </View>
  );
}

function SwapIcon({ focused }: { focused: boolean }) {
  const c = focused ? colors.primary : colors.textSecondary;
  return (
    <View style={ti.wrap}>
      <Text style={[ti.swapEmoji, { color: c }]}>⟳</Text>
      <Text style={[ti.label, { color: c }]}>Swap</Text>
    </View>
  );
}

function ProfileIcon({ focused }: { focused: boolean }) {
  const c = focused ? colors.primary : colors.textSecondary;
  return (
    <View style={ti.wrap}>
      <View style={[ti.profileHead, { borderColor: c }]} />
      <View style={[ti.profileBody, { borderColor: c }]} />
      <Text style={[ti.label, { color: c }]}>Profile</Text>
    </View>
  );
}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <HomeIcon focused={focused} /> }}
      />
      <Tabs.Screen
        name="refill"
        options={{ tabBarIcon: ({ focused }) => <RefillIcon focused={focused} /> }}
      />
      <Tabs.Screen
        name="swap"
        options={{ tabBarIcon: ({ focused }) => <SwapIcon focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} /> }}
      />
      {/* Hidden routes — not shown in tab bar */}
      <Tabs.Screen name="refill-step2" options={{ href: null }} />
      <Tabs.Screen name="refill-step3" options={{ href: null }} />
      <Tabs.Screen name="swap-details" options={{ href: null }} />
      <Tabs.Screen name="confirmation" options={{ href: null }} />
      <Tabs.Screen name="tracking" options={{ href: null }} />
    </Tabs>
  );
}

const ti = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 4, gap: 3 },
  label: { fontSize: fontSize.xs, fontFamily: fontFamily.medium },
  // House icon
  houseRoof: { width: 0, height: 0, borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginBottom: -1 },
  houseBody: { width: 18, height: 14, borderWidth: 2, borderTopWidth: 0, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 0 },
  houseDoor: { width: 7, height: 8, borderWidth: 1.5, borderBottomWidth: 0 },
  // Drop icon
  drop: { width: 14, height: 18, borderRadius: 7, borderWidth: 2, marginBottom: 0, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  dropTip: { width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  // Swap emoji
  swapEmoji: { fontSize: 22, lineHeight: 24 },
  // Profile
  profileHead: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
  profileBody: { width: 20, height: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth: 2, borderBottomWidth: 0, marginTop: 2 },
});

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 82 : 66,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
    paddingTop: 6,
    elevation: 12,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
});
