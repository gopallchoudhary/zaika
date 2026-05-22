import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homescreen from "../screens/home/Homescreen";
import RestaurantDetailScreen from "../screens/home/RestaurantDetailScreen";
import CartScreen from "../screens/home/CartScreen";
import TrackOrderScreen from "../screens/home/TrackOrderScreen";
import { HomeStackParamList } from "./types";
import { colors } from "../constants/theme";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={Homescreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
    </Stack.Navigator>
  );
}
