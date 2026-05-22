import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<DrawerParamList>;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

export type DrawerParamList = {
  Tabs: NavigatorScreenParams<MainTabsParamList>;
  Settings: undefined;
  Help: undefined;
};

export type MainTabsParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  RestaurantDetail: { restaurantId: string; name: string; price: string };
  Cart: undefined;
  TrackOrder: { orderId: string };
};
