import React from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MainTabsParamList } from "./types";
import { colors, borderRadius, spacing } from "../constants/theme";
import { useCart } from "../context/CartContext";
import { Text } from "../components/ui/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Screens
import HomeStack from "./HomeStack";
import SearchScreen from "../screens/search/SearchScreen";
import OrdersScreen from "../screens/orders/OrdersScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
	const { cartCount } = useCart();
	const insets = useSafeAreaInsets();

	const dynamicTabBarStyle = [
		styles.tabBar,
		{
			height: 64 + insets.bottom,
			paddingBottom: insets.bottom,
		},
	];

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarShowLabel: false,
				tabBarStyle: dynamicTabBarStyle,
				tabBarItemStyle: styles.tabBarItem,
				tabBarIconStyle: styles.tabBarIconStyle,
				tabBarIcon: ({ focused }) => {
					let iconName: keyof typeof Ionicons.glyphMap;
					let label = "";

					switch (route.name) {
						case "HomeStack":
							iconName = focused ? "home" : "home-outline";
							label = "Home";
							break;
						case "Search":
							iconName = focused ? "search" : "search-outline";
							label = "Search";
							break;
						case "Orders":
							iconName = focused ? "receipt" : "receipt-outline";
							label = "Orders";
							break;
						case "Profile":
							iconName = focused ? "person" : "person-outline";
							label = "Profile";
							break;
						default:
							iconName = "ellipse";
							label = "";
					}

					if (focused) {
						return (
							<View style={styles.activeTabPill}>
								<View style={styles.activeIconCircle}>
									<Ionicons name={iconName} size={14} color={colors.white} />
									{route.name === "Orders" && cartCount > 0 && (
										<View style={styles.activeBadgeContainer}>
											<Text variant="bold" color="primary" size={8} style={styles.badgeText}>
												{cartCount}
											</Text>
										</View>
									)}
								</View>
								<Text variant="bold" size="xs" color="white" numberOfLines={1}>
									{label}
								</Text>
							</View>
						);
					}

					return (
						<View style={styles.inactiveIconContainer}>
							<Ionicons name={iconName} size={22} color={colors.mediumGrey} />
							{route.name === "Orders" && cartCount > 0 && (
								<View style={styles.inactiveBadgeContainer}>
									<Text variant="bold" color="white" size={9} style={styles.badgeText}>
										{cartCount}
									</Text>
								</View>
							)}
						</View>
					);
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
						tabBarStyle: isTabHidden ? { display: "none" } : dynamicTabBarStyle,
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
		borderTopWidth: 0,
		elevation: 20,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: -6 },
		shadowOpacity: 0.08,
		shadowRadius: 16,
		paddingHorizontal: 8,
	},
	tabBarItem: {
		justifyContent: "center",
		alignItems: "center",
	},
	tabBarIconStyle: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
	activeTabPill: {
		position: "absolute",
		top: "50%",
		marginTop: -19,
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.primary,
		paddingVertical: 5,
		paddingLeft: 4,
		paddingRight: 12,
		borderRadius: 19,
		height: 38,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.24,
		shadowRadius: 6,
		elevation: 4,
	},
	activeIconCircle: {
		width: 30,
		height: 30,
		borderRadius: 15,
		borderWidth: 1.5,
		borderColor: "rgba(255, 255, 255, 0.6)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 6,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
	},
	inactiveIconContainer: {
		position: "absolute",
		top: "50%",
		marginTop: -19,
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		width: 38,
		height: 38,
	},
	tabBarLabel: {
		fontFamily: "Manrope_600SemiBold",
		fontSize: 11,
	},
	activeBadgeContainer: {
		position: "absolute",
		top: -4,
		right: -4,
		backgroundColor: colors.white,
		minWidth: 14,
		height: 14,
		borderRadius: 7,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.primary,
	},
	inactiveBadgeContainer: {
		position: "absolute",
		top: 2,
		right: 2,
		backgroundColor: colors.primary,
		minWidth: 16,
		height: 16,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1.5,
		borderColor: colors.white,
	},
	badgeText: {
		textAlign: "center",
		paddingHorizontal: 1,
	},
});
