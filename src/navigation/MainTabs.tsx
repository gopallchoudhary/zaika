import React from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MainTabsParamList } from "./types";
import { colors, borderRadius, spacing } from "../constants/theme";
import { useCart } from "../context/CartContext";

// Screens
import HomeStack from "./HomeStack";
import SearchScreen from "../screens/search/SearchScreen";
import OrdersScreen from "../screens/orders/OrdersScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  const { cartCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mediumGrey,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "HomeStack":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Search":
              iconName = focused ? "search" : "search-outline";
              break;
            case "Orders":
              iconName = focused ? "receipt" : "receipt-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={({ route }) => {
          // Hide tab bar dynamically on RestaurantDetail, Cart, and TrackOrder screens
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
          const isTabHidden = ["RestaurantDetail", "Cart", "TrackOrder"].includes(routeName);
          
          return {
            tabBarLabel: "Home",
            tabBarStyle: isTabHidden ? { display: "none" } : styles.tabBar,
          };
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Search",
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: "Orders",
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: styles.badgeStyle,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
  },
  badgeStyle: {
    backgroundColor: colors.primary,
    color: colors.white,
    fontFamily: "Manrope_700Bold",
    fontSize: 10,
    lineHeight: 14,
    height: 16,
    minWidth: 16,
    borderRadius: 8,
  },
});
