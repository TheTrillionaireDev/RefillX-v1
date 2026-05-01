import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

import type { ReactElement } from 'react';

interface AccordionItem {
  key: string;
  icon: string;
  label: string;
  content: () => ReactElement;
}

function AccordionSection({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={acc.container}>
      <TouchableOpacity
        style={acc.header}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.85}
      >
        <View style={acc.left}>
          <Text style={acc.icon}>{item.icon}</Text>
          <Text style={acc.label}>{item.label}</Text>
        </View>
        <Text style={acc.chevron}>{open ? '∧' : '∨'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={acc.body}>
          {item.content()}
        </View>
      )}
    </View>
  );
}

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const name = user?.name ?? 'User';
  const address = user?.address ?? '—';
  const phone = user?.phone ?? '—';

  function confirmLogout() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out', style: 'destructive',
          onPress: () => { logout(); router.replace('/(auth)/phone'); },
        },
      ],
    );
  }

  const sections: AccordionItem[] = [
    {
      key: 'cylinders',
      icon: '🔥',
      label: 'My Cylinders',
      content: () => (
        <View style={prof.infoBlock}>
          <Text style={prof.infoLabel}>Last refill</Text>
          <Text style={prof.infoValue}>12.5kg · 3 days ago</Text>
          <Text style={prof.infoLabel} numberOfLines={0}>Last swap</Text>
          <Text style={prof.infoValue}>None</Text>
        </View>
      ),
    },
    {
      key: 'address',
      icon: '📍',
      label: 'My Address',
      content: () => (
        <View style={prof.infoBlock}>
          <Text style={prof.infoValue}>{address}</Text>
          <TouchableOpacity style={prof.editBtn}>
            <Text style={prof.editBtnText}>Edit Address</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: 'contact',
      icon: '👤',
      label: 'Contact Details',
      content: () => (
        <View style={prof.infoBlock}>
          <Text style={prof.infoLabel}>Name</Text>
          <Text style={prof.infoValue}>{name}</Text>
          <Text style={prof.infoLabel}>Phone</Text>
          <Text style={prof.infoValue}>{phone}</Text>
        </View>
      ),
    },
    {
      key: 'wallet',
      icon: '💳',
      label: 'Wallet / Payment',
      content: () => (
        <View style={prof.infoBlock}>
          <Text style={prof.infoValue}>No saved cards yet.</Text>
          <TouchableOpacity style={prof.editBtn}>
            <Text style={prof.editBtnText}>Add Card</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: 'support',
      icon: '🎧',
      label: 'Support',
      content: () => (
        <View style={prof.infoBlock}>
          <TouchableOpacity style={prof.supportItem}>
            <Text style={prof.supportText}>📞  Call us: 0800-REFILLX</Text>
          </TouchableOpacity>
          <TouchableOpacity style={prof.supportItem}>
            <Text style={prof.supportText}>💬  WhatsApp us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={prof.supportItem}>
            <Text style={prof.supportText}>✉️  Email: hello@refillx.app</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: 'referrals',
      icon: '🎁',
      label: 'Referrals',
      content: () => (
        <View style={prof.infoBlock}>
          <Text style={prof.infoLabel}>Your referral code</Text>
          <View style={prof.codeBox}>
            <Text style={prof.code}>GLORY2026</Text>
          </View>
          <Text style={prof.infoValue}>Share this code and earn ₦500 per referral.</Text>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{name[0]}</Text>
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{name} {user?.name === 'Glory' ? 'Adeyemi' : ''}</Text>
          <Text style={styles.userAddress}>{address.split(',').slice(0, 2).join(',')}</Text>
          <Text style={styles.userPhone}>{phone}</Text>
        </View>

        {/* Accordion sections */}
        <View style={styles.sections}>
          {sections.map((item) => (
            <AccordionSection key={item.key} item={item} />
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={confirmLogout} activeOpacity={0.85}>
          <Text style={styles.signOutIcon}>↪</Text>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const acc = StyleSheet.create({
  container: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    overflow: 'hidden', marginBottom: spacing.sm,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.lg,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: { fontSize: 18 },
  label: { fontSize: fontSize.base, fontFamily: fontFamily.medium, color: colors.textPrimary },
  chevron: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fontFamily.regular },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, borderTopWidth: 1, borderTopColor: colors.borderLight },
});

const prof = StyleSheet.create({
  infoBlock: { paddingTop: spacing.md, gap: 6 },
  infoLabel: { fontSize: fontSize.xs, fontFamily: fontFamily.medium, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.sm },
  infoValue: { fontSize: fontSize.base, fontFamily: fontFamily.regular, color: colors.textPrimary },
  editBtn: { marginTop: spacing.sm, alignSelf: 'flex-start' },
  editBtnText: { fontSize: fontSize.sm, fontFamily: fontFamily.bold, color: colors.primary },
  supportItem: { paddingVertical: 10 },
  supportText: { fontSize: fontSize.base, fontFamily: fontFamily.regular, color: colors.textPrimary },
  codeBox: { backgroundColor: colors.primaryLight, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, alignSelf: 'flex-start', marginTop: 4 },
  code: { fontSize: fontSize.lg, fontFamily: fontFamily.bold, color: colors.primary, letterSpacing: 1 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
  pageTitle: { fontSize: fontSize.xl, fontFamily: fontFamily.bold, color: colors.textPrimary, paddingTop: spacing.xl, marginBottom: spacing.xl },

  avatarSection: { alignItems: 'center', marginBottom: spacing.xxl },
  avatarWrap: { position: 'relative', marginBottom: spacing.md },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 36, fontFamily: fontFamily.bold, color: colors.primary },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background,
  },
  cameraIcon: { fontSize: 14 },
  userName: { fontSize: fontSize.xl, fontFamily: fontFamily.bold, color: colors.textPrimary, marginBottom: 4 },
  userAddress: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary },
  userPhone: { fontSize: fontSize.sm, fontFamily: fontFamily.regular, color: colors.textSecondary },

  sections: { marginBottom: spacing.lg },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: colors.dark, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  signOutIcon: { fontSize: 18, color: colors.error },
  signOutText: { fontSize: fontSize.base, fontFamily: fontFamily.bold, color: colors.error },
});
