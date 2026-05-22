import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { HomeStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "TrackOrder">;

const { width } = Dimensions.get("window");

export default function TrackOrderScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const [timeLeft, setTimeLeft] = useState(25); // 25 minutes left

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: `Track Order #${orderId.toUpperCase()}`,
      headerTitleStyle: {
        fontFamily: "Manrope_700Bold",
        fontSize: 16,
        color: colors.charcoal,
      },
      headerStyle: {
        backgroundColor: colors.white,
      },
      headerTintColor: colors.primary,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => {
            // Safe reset behavior when navigating back
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          }}
        >
          <Ionicons name="home-outline" size={20} color={colors.primary} />
          <Text variant="semibold" size="xs" color="primary" style={styles.backBtnText}>
            Home
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, orderId]);

  // Simulated countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000); // Decr every minute
    return () => clearInterval(timer);
  }, []);

  const handleCall = () => {
    Alert.alert("Calling Rider", "Connecting you to James Cooper (+91 98234-XXXXX)...");
  };

  const handleChat = () => {
    Alert.alert("Chatting", "Rider: 'On my way! Please be ready at your delivery gate.'");
  };

  return (
    <View style={styles.container}>
      {/* Mock Map / Visual Delivery Canvas */}
      <View style={styles.mapContainer}>
        {/* Visual elements representing paths */}
        <View style={styles.mapGridLineH} />
        <View style={[styles.mapGridLineH, { top: "60%" }]} />
        <View style={styles.mapGridLineV} />
        <View style={[styles.mapGridLineV, { left: "70%" }]} />
        
        {/* Path line connecting marker to home */}
        <View style={styles.deliveryPathLine} />

        {/* Restaurant Pin */}
        <View style={[styles.mapMarker, styles.restMarker]}>
          <Ionicons name="restaurant" size={14} color={colors.white} />
          <View style={styles.markerTooltip}>
            <Text variant="bold" size="xs" color="white" style={styles.tooltipText}>
              Kitchen
            </Text>
          </View>
        </View>

        {/* Rider Pin */}
        <View style={[styles.mapMarker, styles.riderMarker]}>
          <View style={styles.riderPulse} />
          <Ionicons name="bicycle" size={16} color={colors.white} />
        </View>

        {/* Home Pin */}
        <View style={[styles.mapMarker, styles.homeMarker]}>
          <Ionicons name="home" size={14} color={colors.white} />
          <View style={[styles.markerTooltip, styles.homeTooltip]}>
            <Text variant="bold" size="xs" color="white" style={styles.tooltipText}>
              You
            </Text>
          </View>
        </View>
      </View>

      {/* Floating Info Overlay */}
      <View style={styles.infoOverlay}>
        {/* Estimated Delivery Time */}
        <View style={styles.timeCard}>
          <View style={styles.timeDetails}>
            <Text variant="medium" size="xs" color="textGrey">
              ESTIMATED ARRIVAL
            </Text>
            <Text variant="bold" size="xxl" color="charcoal" style={styles.timeVal}>
              {timeLeft} Mins
            </Text>
            <Text variant="semibold" size="xs" color="pastelGreen" style={styles.ontimeText}>
              On Time · Food is Fresh
            </Text>
          </View>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=200&q=80" }}
            style={styles.timeImage}
          />
        </View>

        {/* Delivery Progress Timeline Stepper */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineRow}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.timelineDot, styles.timelineDotDone]} />
              <View style={[styles.timelineBar, styles.timelineBarDone]} />
            </View>
            <View style={styles.timelineContent}>
              <Text variant="bold" size="sm" color="charcoal">
                Order Confirmed
              </Text>
              <Text variant="medium" size="xs" color="textGrey">
                Your order is accepted by the kitchen
              </Text>
            </View>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.timelineDot, styles.timelineDotDone]} />
              <View style={[styles.timelineBar, styles.timelineBarDone]} />
            </View>
            <View style={styles.timelineContent}>
              <Text variant="bold" size="sm" color="charcoal">
                Preparing Food
              </Text>
              <Text variant="medium" size="xs" color="textGrey">
                Chef is packaging your warm meals
              </Text>
            </View>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.timelineDot, styles.timelineDotActive]} />
              <View style={[styles.timelineBar, styles.timelineBarPending]} />
            </View>
            <View style={styles.timelineContent}>
              <Text variant="bold" size="sm" color="charcoal">
                Out for Delivery
              </Text>
              <Text variant="semibold" size="xs" color="primary">
                James Cooper is approaching your gate
              </Text>
            </View>
          </View>

          <View style={[styles.timelineRow, { marginBottom: 0 }]}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.timelineDot, styles.timelineDotPending]} />
            </View>
            <View style={styles.timelineContent}>
              <Text variant="bold" size="sm" color="textGrey">
                Delivered
              </Text>
              <Text variant="medium" size="xs" color="textGrey">
                Enjoy your delicious meal!
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Rider Profile Card */}
        <View style={styles.riderCard}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" }}
            style={styles.riderAvatar}
          />
          <View style={styles.riderInfo}>
            <Text variant="bold" size="md" color="charcoal">
              James Cooper
            </Text>
            <View style={styles.riderRatingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text variant="bold" size="xs" color="charcoal" style={styles.riderRatingVal}>
                4.9
              </Text>
              <Text variant="medium" size="xs" color="textGrey" style={styles.riderTripCount}>
                · Delivery Partner
              </Text>
            </View>
          </View>
          <View style={styles.riderActions}>
            <TouchableOpacity style={styles.riderActionBtn} activeOpacity={0.7} onPress={handleChat}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.riderActionBtn, styles.callBtn]} activeOpacity={0.7} onPress={handleCall}>
              <Ionicons name="call" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Return to Home Reset Stack */}
        <TouchableOpacity
          style={styles.footerHomeBtn}
          activeOpacity={0.8}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          }}
        >
          <Text variant="bold" size="md" color="white">
            Go back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  backBtnText: {
    marginLeft: 4,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#E4ECE0",
    position: "relative",
  },
  mapGridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "30%",
    height: 12,
    backgroundColor: "#D3DFCF",
  },
  mapGridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "30%",
    width: 12,
    backgroundColor: "#D3DFCF",
  },
  deliveryPathLine: {
    position: "absolute",
    top: "30.5%",
    left: "30.5%",
    right: "30.5%",
    height: 6,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 1,
  },
  mapMarker: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  restMarker: {
    backgroundColor: colors.charcoal,
    top: "25%",
    left: "25%",
  },
  riderMarker: {
    backgroundColor: colors.primary,
    top: "27.5%",
    left: "50%",
  },
  riderPulse: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(254, 110, 32, 0.25)",
    zIndex: -1,
  },
  homeMarker: {
    backgroundColor: "#4CAF50",
    top: "25%",
    right: "25%",
  },
  markerTooltip: {
    position: "absolute",
    bottom: 38,
    backgroundColor: colors.charcoal,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  homeTooltip: {
    backgroundColor: "#4CAF50",
  },
  tooltipText: {
    fontSize: 9,
  },
  infoOverlay: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  timeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  timeDetails: {
    flex: 1,
  },
  timeVal: {
    marginTop: 4,
    marginBottom: 2,
  },
  ontimeText: {
    color: "#2E7D32",
  },
  timeImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
  },
  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  timelineRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  timelineIndicator: {
    alignItems: "center",
    marginRight: spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineDotDone: {
    backgroundColor: "#2E7D32",
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: "rgba(254, 110, 32, 0.2)",
  },
  timelineDotPending: {
    backgroundColor: colors.borderGrey,
  },
  timelineBar: {
    width: 2,
    height: 36,
  },
  timelineBarDone: {
    backgroundColor: "#2E7D32",
  },
  timelineBarPending: {
    backgroundColor: colors.borderGrey,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 1,
  },
  riderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    marginBottom: spacing.lg,
  },
  riderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.md,
  },
  riderInfo: {
    flex: 1,
  },
  riderRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  riderRatingVal: {
    marginLeft: 4,
  },
  riderTripCount: {
    marginLeft: 4,
  },
  riderActions: {
    flexDirection: "row",
  },
  riderActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  callBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footerHomeBtn: {
    backgroundColor: colors.black,
    height: 50,
    borderRadius: borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});
