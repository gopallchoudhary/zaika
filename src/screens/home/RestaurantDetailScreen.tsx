import React, { useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { getRestaurantById } from "../../data/restaurants";
import { getMenuByRestaurant, getCategoriesByRestaurant } from "../../data/menuItems";
import { useCart } from "../../context/CartContext";
import { HomeStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "RestaurantDetail">;

const { width } = Dimensions.get("window");

export default function RestaurantDetailScreen({ route, navigation }: Props) {
  const { restaurantId } = route.params;
  const { cartItems, addToCart, updateQuantity, cartCount, cartTotal } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Fetch restaurant details dynamically (handles deep-link parameter scenarios)
  const restaurant = getRestaurantById(restaurantId);
  const menuItems = getMenuByRestaurant(restaurantId);
  const categories = ["All", ...getCategoriesByRestaurant(restaurantId)];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Custom header implemented below for absolute position overlay
    });
  }, [navigation]);

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.primary} />
        <Text variant="bold" size="lg" color="charcoal" style={styles.errorText}>
          Restaurant Not Found
        </Text>
        <TouchableOpacity style={styles.errorBtn} onPress={() => navigation.goBack()}>
          <Text variant="bold" size="sm" color="white">
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${restaurant.name} on Zaika! Open this link to order: zaika://restaurant/${restaurant.id}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const filteredMenuItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Absolute Header Overlay */}
      <SafeAreaView style={styles.headerOverlay} edges={["top"]}>
        <TouchableOpacity
          style={styles.circleHeaderBtn}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.circleHeaderBtn}
            activeOpacity={0.8}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={20} color={colors.charcoal} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Hero Image */}
        <Image source={{ uri: restaurant.imageUrl }} style={styles.heroImage} />

        {/* Restaurant Info Summary Card */}
        <View style={styles.infoCard}>
          <View style={styles.restaurantNameRow}>
            <Text variant="bold" size="xxl" color="charcoal" style={styles.restaurantName}>
              {restaurant.name}
            </Text>
            <View style={styles.priceBadge}>
              <Text variant="bold" size="xs" color="primary">
                {restaurant.priceRange}
              </Text>
            </View>
          </View>

          <Text variant="medium" size="xs" color="textGrey" style={styles.cuisineText}>
            {restaurant.cuisine}
          </Text>

          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={colors.mediumGrey} />
            <Text variant="medium" size="xs" color="mediumGrey" style={styles.addressText} numberOfLines={1}>
              {restaurant.address}
            </Text>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <View style={styles.statIconRow}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text variant="bold" size="sm" color="charcoal" style={styles.statVal}>
                  {restaurant.rating}
                </Text>
              </View>
              <Text variant="semibold" size="xs" color="textGrey" style={styles.statLbl}>
                {restaurant.reviewCount}+ Ratings
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIconRow}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <Text variant="bold" size="sm" color="charcoal" style={styles.statVal}>
                  {restaurant.deliveryTime}
                </Text>
              </View>
              <Text variant="semibold" size="xs" color="textGrey" style={styles.statLbl}>
                Delivery Time
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIconRow}>
                <Ionicons name="bicycle-outline" size={16} color="#4CAF50" />
                <Text variant="bold" size="sm" color="charcoal" style={styles.statVal}>
                  {restaurant.deliveryFee === 0 ? "Free" : `₹${restaurant.deliveryFee}`}
                </Text>
              </View>
              <Text variant="semibold" size="xs" color="textGrey" style={styles.statLbl}>
                Delivery Fee
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Section Header */}
        <View style={styles.menuHeaderRow}>
          <Text variant="bold" size="lg" color="charcoal">
            Menu Specials
          </Text>
        </View>

        {/* Categories Horizontal Selector */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  variant="bold"
                  size="xs"
                  color={isSelected ? "white" : "charcoal"}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Menu Items List */}
        <View style={styles.menuContainer}>
          {filteredMenuItems.map((item) => {
            const cartItem = cartItems.find((ci) => ci.menuItem.id === item.id);
            const quantity = cartItem?.quantity || 0;

            return (
              <View key={item.id} style={styles.menuItemCard}>
                <View style={styles.menuItemDetails}>
                  <View style={styles.menuItemHeader}>
                    {/* Diet Type Dot Indicator */}
                    <View
                      style={[
                        styles.dietDotBorder,
                        { borderColor: item.dietType === "veg" || item.dietType === "vegan" ? "#4CAF50" : "#F44336" },
                      ]}
                    >
                      <View
                        style={[
                          styles.dietDot,
                          { backgroundColor: item.dietType === "veg" || item.dietType === "vegan" ? "#4CAF50" : "#F44336" },
                        ]}
                      />
                    </View>
                    {item.isPopular && (
                      <View style={styles.popularBadge}>
                        <Ionicons name="sparkles" size={10} color={colors.white} />
                        <Text variant="bold" size="xs" color="white" style={styles.popularText}>
                          Bestseller
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text variant="bold" size="md" color="charcoal" style={styles.itemName}>
                    {item.name}
                  </Text>
                  
                  <Text variant="bold" size="sm" color="primary" style={styles.itemPrice}>
                    ₹{item.price}
                  </Text>

                  <Text variant="medium" size="xs" color="textGrey" style={styles.itemDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>

                {/* Add to Cart Column */}
                <View style={styles.menuItemRight}>
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  
                  <View style={styles.actionBtnContainer}>
                    {quantity > 0 ? (
                      <View style={styles.quantityAdjuster}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.id, quantity - 1)}
                        >
                          <Ionicons name="remove" size={14} color={colors.white} />
                        </TouchableOpacity>
                        <Text variant="bold" size="xs" color="white" style={styles.qtyText}>
                          {quantity}
                        </Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.id, quantity + 1)}
                        >
                          <Ionicons name="add" size={14} color={colors.white} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addButton}
                        activeOpacity={0.8}
                        onPress={() => addToCart(item)}
                      >
                        <Text variant="bold" size="xs" color="primary">
                          ADD
                        </Text>
                        <Ionicons name="add" size={12} color={colors.primary} style={styles.addIcon} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Sticky Checkout Footer */}
      {cartCount > 0 && (
        <SafeAreaView style={styles.floatingCheckout} edges={["bottom"]}>
          <TouchableOpacity
            style={styles.checkoutBar}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Cart")}
          >
            <View style={styles.checkoutBarLeft}>
              <View style={styles.itemCountBadge}>
                <Text variant="bold" size="xs" color="primary">
                  {cartCount}
                </Text>
              </View>
              <View style={styles.checkoutDetails}>
                <Text variant="bold" size="sm" color="white">
                  View your cart
                </Text>
                <Text variant="semibold" size="xs" color="white" style={styles.checkoutSubtext}>
                  From multiple tasty dishes
                </Text>
              </View>
            </View>
            <View style={styles.checkoutBarRight}>
              <Text variant="bold" size="md" color="white" style={styles.checkoutTotalText}>
                ₹{cartTotal}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  circleHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRightActions: {
    flexDirection: "row",
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  heroImage: {
    width: width,
    height: 220,
    resizeMode: "cover",
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: -30,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  restaurantNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  restaurantName: {
    flex: 1,
    marginRight: spacing.sm,
  },
  priceBadge: {
    backgroundColor: "rgba(254, 110, 32, 0.08)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  cuisineText: {
    marginTop: 4,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  addressText: {
    marginLeft: 4,
    flex: 1,
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: spacing.md,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statVal: {
    marginLeft: 4,
  },
  statLbl: {
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.borderGrey,
  },
  menuHeaderRow: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  categoryScroll: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  categoryPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  categoryPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  menuContainer: {
    paddingHorizontal: spacing.lg,
  },
  menuItemCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  menuItemDetails: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dietDotBorder: {
    width: 14,
    height: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginRight: spacing.xs,
  },
  dietDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  popularBadge: {
    backgroundColor: colors.orange,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    marginLeft: 2,
    fontSize: 9,
  },
  itemName: {
    marginBottom: 2,
  },
  itemPrice: {
    marginBottom: 6,
  },
  itemDesc: {
    lineHeight: 16,
  },
  menuItemRight: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    resizeMode: "cover",
  },
  actionBtnContainer: {
    position: "absolute",
    bottom: -10,
    width: 80,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    marginLeft: 2,
  },
  quantityAdjuster: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    marginHorizontal: 4,
  },
  floatingCheckout: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
  },
  checkoutBar: {
    height: 56,
    backgroundColor: colors.black,
    borderRadius: borderRadius.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutBarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCountBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  checkoutDetails: {
    justifyContent: "center",
  },
  checkoutSubtext: {
    opacity: 0.8,
    fontSize: 10,
    marginTop: 1,
  },
  checkoutBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkoutTotalText: {
    marginRight: spacing.xs,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  errorBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
});