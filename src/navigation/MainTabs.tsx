import * as React from "react";
import { Text, View } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "../screens/profile/ProfileScreen";
import OrdersScreen from "../screens/orders/OrdersScreen";
import SearchScreen from "../screens/search/SearchScreen";
import HomeStack from "./HomeStack";

const Tab = createBottomTabNavigator();

function MyTabs() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'Home') {
						iconName = focused ? 'home' : 'home-outline';
					} else if (route.name === 'Search') {
						iconName = focused ? 'search' : 'search-outline';
					} else if (route.name === 'Orders') {
						iconName = focused ? 'list' : 'list-outline';
					} else if (route.name === 'Profile') {
						iconName = focused ? 'person' : 'person-outline';
					}

					return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
				},
			})}
		>
			<Tab.Screen name="Home" component={HomeStack} />
			<Tab.Screen name="Search" component={SearchScreen} />
			<Tab.Screen name="Orders" component={OrdersScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
}

export default function MainTabs() {
	return (
		<NavigationContainer>
			<MyTabs />
		</NavigationContainer>
	);
}
