import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { DrawerParamList } from "./types";
import MainTabs from "./MainTabs";
import SettingsScreen from "../screens/drawer/SettingsScreen";
import HelpScreen from "../screens/drawer/HelpScreen";
import { colors, borderRadius, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { Text } from "../components/ui/Text";

const Drawer = createDrawerNavigator<DrawerParamList>();

function CustomDrawerContent(props: any) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout from Zaika?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={28} color={colors.mediumGrey} />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text variant="bold" size="md" color="charcoal" numberOfLines={1}>
              {user?.name || "Gopal Chaudhary"}
            </Text>
            <Text variant="medium" size="xs" color="textGrey" numberOfLines={1} style={styles.emailText}>
              {user?.email || "gopalchaudhary@example.com"}
            </Text>
          </View>
        </View>

        {/* Navigation Items */}
        <View style={styles.drawerItemsList}>
          {/* Home / Feed */}
          <DrawerItem
            label={() => (
              <Text variant="bold" size="sm" color="charcoal">
                Home Feed
              </Text>
            )}
            icon={({ color, size }) => (
              <Ionicons name="restaurant-outline" size={size} color={colors.primary} />
            )}
            onPress={() => props.navigation.navigate("Tabs", { screen: "HomeStack" })}
            activeTintColor={colors.primary}
            style={styles.drawerItemStyle}
          />

          {/* My Orders */}
          <DrawerItem
            label={() => (
              <Text variant="bold" size="sm" color="charcoal">
                My Orders
              </Text>
            )}
            icon={({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={colors.primary} />
            )}
            onPress={() => props.navigation.navigate("Tabs", { screen: "Orders" })}
            style={styles.drawerItemStyle}
          />

          {/* Settings */}
          <DrawerItem
            label={() => (
              <Text variant="bold" size="sm" color="charcoal">
                Settings
              </Text>
            )}
            icon={({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={colors.primary} />
            )}
            onPress={() => props.navigation.navigate("Settings")}
            style={styles.drawerItemStyle}
          />

          {/* Help & Support */}
          <DrawerItem
            label={() => (
              <Text variant="bold" size="sm" color="charcoal">
                Help & FAQs
              </Text>
            )}
            icon={({ color, size }) => (
              <Ionicons name="help-circle-outline" size={size} color={colors.primary} />
            )}
            onPress={() => props.navigation.navigate("Help")}
            style={styles.drawerItemStyle}
          />
        </View>
      </DrawerContentScrollView>

      {/* Logout Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E53935" />
          <Text variant="bold" size="sm" color="charcoal" style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
          backgroundColor: colors.background,
        },
        drawerType: "slide",
      }}
    >
      <Drawer.Screen name="Tabs" component={MainTabs} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingTop: 0,
  },
  profileHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.lightGrey,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.sm,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.borderGrey,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  profileInfo: {
    flex: 1,
  },
  emailText: {
    marginTop: 2,
  },
  drawerItemsList: {
    paddingHorizontal: spacing.sm,
  },
  drawerItemStyle: {
    borderRadius: borderRadius.md,
    marginVertical: 2,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    backgroundColor: colors.white,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  logoutText: {
    marginLeft: spacing.sm,
    color: "#E53935",
  },
});
