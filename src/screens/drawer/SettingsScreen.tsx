import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function SettingsScreen({ navigation }: NativeStackScreenProps<any>) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text variant="semibold" size="xs" color="primary" style={styles.backText}>
            Back
          </Text>
        </TouchableOpacity>
        <Text variant="bold" size="md" color="charcoal">
          Settings
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.sectionHeader}>
          <Text variant="bold" size="sm" color="textGrey" style={styles.sectionHeaderTitle}>
            PREFERENCES
          </Text>
        </View>

        <View style={styles.card}>
          {/* Push Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBg, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="notifications-outline" size={16} color="#43A047" />
              </View>
              <View>
                <Text variant="bold" size="sm" color="charcoal">
                  Push Notifications
                </Text>
                <Text variant="medium" size="xs" color="textGrey">
                  Alerts for order status, updates
                </Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.borderGrey, true: colors.pastelGreen }}
              thumbColor={pushEnabled ? colors.primary : colors.mediumGrey}
            />
          </View>

          <View style={styles.divider} />

          {/* Location Services */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBg, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="location-outline" size={16} color="#1E88E5" />
              </View>
              <View>
                <Text variant="bold" size="sm" color="charcoal">
                  GPS Location Services
                </Text>
                <Text variant="medium" size="xs" color="textGrey">
                  Track delivery riders in real-time
                </Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: colors.borderGrey, true: colors.pastelGreen }}
              thumbColor={locationEnabled ? colors.primary : colors.mediumGrey}
            />
          </View>

          <View style={styles.divider} />

          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBg, { backgroundColor: "#ECEFF1" }]}>
                <Ionicons name="moon-outline" size={16} color="#37474F" />
              </View>
              <View>
                <Text variant="bold" size="sm" color="charcoal">
                  Theme Dark Mode
                </Text>
                <Text variant="medium" size="xs" color="textGrey">
                  Toggle application night theme
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.borderGrey, true: colors.pastelGreen }}
              thumbColor={darkMode ? colors.primary : colors.mediumGrey}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text variant="bold" size="sm" color="textGrey" style={styles.sectionHeaderTitle}>
            LEGAL & INFORMATION
          </Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.infoRow} activeOpacity={0.7}>
            <Text variant="semibold" size="sm" color="charcoal">
              Terms of Service
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mediumGrey} />
          </TouchableOpacity>
          
          <View style={styles.divider} />

          <TouchableOpacity style={styles.infoRow} activeOpacity={0.7}>
            <Text variant="semibold" size="sm" color="charcoal">
              Privacy Policy
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mediumGrey} />
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text variant="medium" size="xs" color="textGrey">
            Zaika App Version 1.0.0
          </Text>
          <Text variant="medium" size="xs" color="textGrey" style={{ marginTop: 2 }}>
            © 2026 Zaika Food Systems
          </Text>
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
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    width: 48,
  },
  backText: {
    marginLeft: 4,
  },
  scrollContainer: {
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionHeaderTitle: {
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGrey,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  versionContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
  },
});
