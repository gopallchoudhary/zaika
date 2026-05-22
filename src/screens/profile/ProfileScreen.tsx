import React from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { CompositeNavigationProp } from "@react-navigation/native";

type Props = {
  navigation: CompositeNavigationProp<any, DrawerNavigationProp<any>>;
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "May 2026";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    } catch {
      return "May 2026";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Custom Profile Header */}
      <View style={styles.header}>
        <Text variant="bold" size="xl" color="charcoal">
          My Profile
        </Text>
        <TouchableOpacity
          style={styles.drawerTrigger}
          onPress={() => (navigation as any).openDrawer?.()}
        >
          <Ionicons name="options-outline" size={22} color={colors.charcoal} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* User Bio Card */}
        <View style={styles.bioCard}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={colors.mediumGrey} />
            </View>
          )}
          <Text variant="bold" size="lg" color="charcoal" style={styles.name}>
            {user?.name || "Aria Chen"}
          </Text>
          <Text variant="medium" size="xs" color="textGrey">
            {user?.email || "ariachen@example.com"}
          </Text>
          <Text variant="semibold" size="xs" color="primary" style={styles.joinedText}>
            Member since {formatDate(user?.joinedAt)}
          </Text>
        </View>

        {/* Saved Addresses Section */}
        <View style={styles.sectionHeader}>
          <Text variant="bold" size="md" color="charcoal">
            Saved Addresses
          </Text>
        </View>
        <View style={styles.addressList}>
          {user?.addresses && user.addresses.length > 0 ? (
            user.addresses.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <Ionicons
                    name={address.label === "Home" ? "home-outline" : "briefcase-outline"}
                    size={16}
                    color={colors.primary}
                  />
                  <Text variant="bold" size="sm" color="charcoal" style={styles.addressLabel}>
                    {address.label}
                  </Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text variant="bold" size="xs" color="white" style={styles.defaultBadgeText}>
                        DEFAULT
                      </Text>
                    </View>
                  )}
                </View>
                <Text variant="medium" size="xs" color="textGrey" style={styles.addressText}>
                  {address.line1}, {address.line2 ? `${address.line2}, ` : ""}{address.city} - {address.pincode}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyAddress}>
              <Text variant="medium" size="xs" color="mediumGrey">
                No addresses saved yet.
              </Text>
            </View>
          )}
        </View>

        {/* Profile Settings Options */}
        <View style={styles.sectionHeader}>
          <Text variant="bold" size="md" color="charcoal">
            Account Actions
          </Text>
        </View>
        <View style={styles.optionsList}>
          {/* Settings */}
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Settings")}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIconBg, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="settings-outline" size={18} color="#1E88E5" />
              </View>
              <Text variant="semibold" size="sm" color="charcoal">
                Account Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mediumGrey} />
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Help")}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIconBg, { backgroundColor: "#FFF3E0" }]}>
                <Ionicons name="help-circle-outline" size={18} color="#FB8C00" />
              </View>
              <Text variant="semibold" size="sm" color="charcoal">
                Help & Support
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mediumGrey} />
          </TouchableOpacity>

          {/* Open Drawer */}
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() => (navigation as any).openDrawer?.()}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIconBg, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="menu-outline" size={18} color="#43A047" />
              </View>
              <Text variant="semibold" size="sm" color="charcoal">
                Open Navigation Drawer
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mediumGrey} />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.optionRow, styles.logoutRow]}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIconBg, { backgroundColor: "#FFEBEE" }]}>
                <Ionicons name="log-out-outline" size={18} color="#E53935" />
              </View>
              <Text variant="bold" size="sm" color="charcoal">
                Logout
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#E53935" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  drawerTrigger: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: spacing.xxl,
  },
  bioCard: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  name: {
    marginBottom: 2,
  },
  joinedText: {
    marginTop: spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  addressList: {
    paddingHorizontal: spacing.lg,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  addressLabel: {
    marginLeft: 6,
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 8,
  },
  addressText: {
    lineHeight: 18,
  },
  emptyAddress: {
    padding: spacing.md,
    alignItems: "center",
  },
  optionsList: {
    paddingHorizontal: spacing.lg,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  logoutRow: {
    borderColor: "#FFEBEE",
    backgroundColor: "rgba(255, 235, 238, 0.05)",
  },
});