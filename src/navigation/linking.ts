import { LinkingOptions } from "@react-navigation/native";
import { RootStackParamList } from "./types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["foodapp://", "zaika://"],
  config: {
    screens: {
      Auth: {
        screens: {
          Onboarding: "onboarding",
          Login: "login",
          Signup: "signup",
        },
      },
      Main: {
        screens: {
          Tabs: {
            screens: {
              HomeStack: {
                screens: {
                  Home: "home",
                  RestaurantDetail: {
                    path: "restaurant/:restaurantId",
                    parse: {
                      restaurantId: (id: string) => id,
                    },
                  },
                  Cart: "cart",
                  TrackOrder: "track/:orderId",
                },
              },
              Search: "search",
              Orders: "orders",
              Profile: "profile",
            },
          },
          Settings: "settings",
          Help: "help",
        },
      },
    },
  },
};

export default linking;
