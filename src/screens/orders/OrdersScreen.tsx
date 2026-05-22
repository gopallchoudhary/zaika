import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import {
  ORDERS,
  getActiveOrders,
  getPastOrders,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
} from "../../data/orders";
import { Order } from "../../data/types";

const { width } = Dimensions.get("window");

export default function OrdersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  const activeOrders = getActiveOrders();
  const pastOrders = getPastOrders();
  const displayedOrders = activeTab === "active" ? activeOrders : pastOrders;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadgeStyle = (status: Order["status"]) => {
    const rawColor = ORDER_STATUS_COLOR[status] || colors.mediumGrey;
    
    // Generate soft light pastel background for the badge and high-contrast text color
    switch (status) {
      case "placed":
        return { bg: "#FEF3C7", text: "#D97706" }; // Amber
      case "confirmed":
        return { bg: "#DBEAFE", text: "#2563EB" }; // Blue
      case "preparing":
        return { bg: "#F3E8FF", text: "#7C3AED" }; // Purple
      case "out_for_delivery":
        return { bg: "#D1FAE5", text: "#059669" }; // Green
      case "delivered":
        return { bg: "#E5E7EB", text: "#4B5563" }; // Gray
      case "cancelled":
        return { bg: "#FEE2E2", text: "#DC2626" }; // Red
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  const renderOrderCard = ({ item }: { item: Order }) => {
    const badgeStyle = getStatusBadgeStyle(item.status);
    const totalItemsCount = item.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View style={styles.orderCard}>
        {/* Card Header: Restaurant Details & Status */}
        <View style={styles.cardHeader}>
          <View style={styles.restaurantRow}>
            {item.restaurantImage ? (
              <Image source={{ uri: item.restaurantImage }} style={styles.restaurantImage} />
            ) : (
              <View style={styles.restaurantPlaceholder}>
                <Ionicons name="restaurant-outline" size={20} color={colors.mediumGrey} />
              </View>
            )}
            <View style={styles.headerTextContainer}>
              <Text variant="bold" size="md" color="charcoal" numberOfLines={1}>
                {item.restaurantName}
              </Text>
              <Text variant="medium" size="xs" color="textGrey" style={styles.dateText}>
                {formatDate(item.placedAt)}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badgeStyle.bg }]}>
            <Text variant="bold" size="xs" color={badgeStyle.text}>
              {ORDER_STATUS_LABEL[item.status]}
            </Text>
          </View>
        </View>

        {/* Card Body: Items List summary */}
        <View style={styles.cardBody}>
          <Text variant="semibold" size="xs" color="mediumGrey" style={styles.itemsHeader}>
            {totalItemsCount} {totalItemsCount === 1 ? "ITEM" : "ITEMS"}
          </Text>
          {item.items.map((orderItem, index) => (
            <View key={`${item.id}-item-${index}`} style={styles.itemRow}>
              <Text variant="medium" size="sm" color="charcoal" style={styles.itemName}>
                {orderItem.name}{" "}
                <Text variant="bold" size="sm" color="primary">
                  × {orderItem.quantity}
                </Text>
              </Text>
              <Text variant="semibold" size="sm" color="charcoal">
                ₹{orderItem.price * orderItem.quantity}
              </Text>
            </View>
          ))}
        </View>

        {/* Card Footer: Billing details and actions */}
        <View style={styles.cardFooter}>
          <View style={styles.totalBillContainer}>
            <Text variant="medium" size="xs" color="textGrey">
              Total Amount
            </Text>
            <Text variant="bold" size="lg" color="primary">
              ₹{item.total}
            </Text>
          </View>

          {item.status === "cancelled" || item.status === "delivered" ? (
            <TouchableOpacity
              style={styles.actionButtonSecondary}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("HomeStack", {
                  screen: "RestaurantDetail",
                  params: {
                    restaurantId: item.restaurantId,
                    name: item.restaurantName,
                    price: "$$",
                  },
                });
              }}
            >
              <Text variant="bold" size="xs" color="primary">
                Order Again
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionButtonPrimary}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("HomeStack", {
                  screen: "TrackOrder",
                  params: { orderId: item.id },
                });
              }}
            >
              <Text variant="bold" size="xs" color="white" style={styles.btnText}>
                Track Order
              </Text>
              <Ionicons name="compass-outline" size={16} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Premium Screen Header */}
      <View style={styles.screenHeader}>
        <Text variant="bold" size="xl" color="charcoal">
          My Orders
        </Text>
        <Text variant="medium" size="xs" color="textGrey">
          Manage your food deliveries and history
        </Text>
      </View>

      {/* Modern Premium Tabs Switch */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "active" && styles.activeTabButton]}
          activeOpacity={0.9}
          onPress={() => setActiveTab("active")}
        >
          <Text
            variant="bold"
            size="sm"
            color={activeTab === "active" ? "primary" : "mediumGrey"}
          >
            Active
          </Text>
          <View
            style={[
              styles.tabBadge,
              { backgroundColor: activeTab === "active" ? colors.primary : colors.grey },
            ]}
          >
            <Text
              variant="bold"
              size="xs"
              color={activeTab === "active" ? "white" : "mediumGrey"}
            >
              {activeOrders.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "past" && styles.activeTabButton]}
          activeOpacity={0.9}
          onPress={() => setActiveTab("past")}
        >
          <Text
            variant="bold"
            size="sm"
            color={activeTab === "past" ? "primary" : "mediumGrey"}
          >
            Past History
          </Text>
          <View
            style={[
              styles.tabBadge,
              { backgroundColor: activeTab === "past" ? colors.primary : colors.grey },
            ]}
          >
            <Text
              variant="bold"
              size="xs"
              color={activeTab === "past" ? "white" : "mediumGrey"}
            >
              {pastOrders.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Orders List / Empty State */}
      {displayedOrders.length > 0 ? (
        <FlatList
          data={displayedOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="receipt-outline" size={48} color={colors.mediumGrey} />
          </View>
          <Text variant="bold" size="lg" color="charcoal" style={styles.emptyTitle}>
            No Orders Yet
          </Text>
          <Text variant="regular" size="sm" color="textGrey" align="center" style={styles.emptySubtitle}>
            {activeTab === "active"
              ? "You do not have any active food preparation or delivery orders right now."
              : "Your culinary journey with Zaika hasn't started yet. Let's order some delicious meals!"}
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("HomeStack", { screen: "Home" })}
          >
            <Text variant="bold" size="sm" color="white" style={styles.btnText}>
              Discover Restaurants
            </Text>
            <Ionicons name="arrow-forward-outline" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
    paddingHorizontal: spacing.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: colors.primary,
  },
  tabBadge: {
    marginLeft: spacing.xs,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
    paddingBottom: spacing.sm,
  },
  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: spacing.sm,
  },
  restaurantImage: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  restaurantPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.grey,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  headerTextContainer: {
    flex: 1,
  },
  dateText: {
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  cardBody: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  itemsHeader: {
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  itemName: {
    flex: 1,
    paddingRight: spacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
  },
  totalBillContainer: {
    justifyContent: "center",
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    height: 38,
    borderRadius: borderRadius.md,
  },
  actionButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    marginRight: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.grey,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    lineHeight: 20,
    marginBottom: spacing.xxl,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    height: 48,
    borderRadius: borderRadius.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
});