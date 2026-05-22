import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { RESTAURANTS } from "../../data/restaurants";
import { MENU_ITEMS } from "../../data/menuItems";
import { useCart } from "../../context/CartContext";
import { RestaurantCard } from "../../components/cards/RestaurantCard";
import { MenuItem } from "../../data/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const POPULAR_SEARCHES = ["Burgers", "Paneer Tikka", "Biryani", "Pizza", "Salads", "Healthy Bowls"];

type FilterKeys = "freeDelivery" | "under30" | "topRated" | "vegOnly";

export default function SearchScreen({ navigation }: NativeStackScreenProps<any>) {
  const [query, setQuery] = useState("");
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [filters, setFilters] = useState<Record<FilterKeys, boolean>>({
    freeDelivery: false,
    under30: false,
    topRated: false,
    vegOnly: false,
  });

  const toggleFilter = (key: FilterKeys) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Perform search and filter
  const getSearchResults = () => {
    const q = query.toLowerCase().trim();

    // 1. Filter Restaurants
    let matchedRestaurants = RESTAURANTS;
    if (q) {
      matchedRestaurants = RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Apply filters to restaurants
    if (filters.freeDelivery) {
      matchedRestaurants = matchedRestaurants.filter((r) => r.deliveryFee === 0);
    }
    if (filters.under30) {
      matchedRestaurants = matchedRestaurants.filter((r) => {
        const timeNum = parseInt(r.deliveryTime);
        return !isNaN(timeNum) && timeNum <= 30;
      });
    }
    if (filters.topRated) {
      matchedRestaurants = matchedRestaurants.filter((r) => r.rating >= 4.5);
    }

    // 2. Filter Dishes
    let matchedDishes = MENU_ITEMS;
    if (q) {
      matchedDishes = MENU_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    } else {
      // If no query, don't show all dishes by default unless some filter is active
      if (!filters.vegOnly) matchedDishes = [];
    }

    // Apply filters to dishes
    if (filters.vegOnly) {
      matchedDishes = matchedDishes.filter(
        (item) => item.dietType === "veg" || item.dietType === "vegan"
      );
    }

    return {
      restaurants: matchedRestaurants,
      dishes: matchedDishes,
    };
  };

  const { restaurants, dishes } = getSearchResults();

  const handlePopularSearch = (term: string) => {
    setQuery(term);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Search Header Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.mediumGrey} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants or delicious dishes..."
            placeholderTextColor={colors.mediumGrey}
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.mediumGrey} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips List */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsContainer}>
          <TouchableOpacity
            style={[styles.filterChip, filters.vegOnly && styles.filterChipActive]}
            activeOpacity={0.8}
            onPress={() => toggleFilter("vegOnly")}
          >
            <Ionicons name="leaf-outline" size={14} color={filters.vegOnly ? colors.white : colors.charcoal} />
            <Text variant="bold" size="xs" color={filters.vegOnly ? "white" : "charcoal"} style={styles.filterChipText}>
              Veg Only
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filters.topRated && styles.filterChipActive]}
            activeOpacity={0.8}
            onPress={() => toggleFilter("topRated")}
          >
            <Ionicons name="star-outline" size={14} color={filters.topRated ? colors.white : colors.charcoal} />
            <Text variant="bold" size="xs" color={filters.topRated ? "white" : "charcoal"} style={styles.filterChipText}>
              Top Rated (4.5+)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filters.freeDelivery && styles.filterChipActive]}
            activeOpacity={0.8}
            onPress={() => toggleFilter("freeDelivery")}
          >
            <Ionicons name="bicycle-outline" size={14} color={filters.freeDelivery ? colors.white : colors.charcoal} />
            <Text variant="bold" size="xs" color={filters.freeDelivery ? "white" : "charcoal"} style={styles.filterChipText}>
              Free Delivery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filters.under30 && styles.filterChipActive]}
            activeOpacity={0.8}
            onPress={() => toggleFilter("under30")}
          >
            <Ionicons name="time-outline" size={14} color={filters.under30 ? colors.white : colors.charcoal} />
            <Text variant="bold" size="xs" color={filters.under30 ? "white" : "charcoal"} style={styles.filterChipText}>
              Under 30 min
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* If no query is entered, show popular search options */}
        {!query && !filters.vegOnly && (
          <View style={styles.popularSearchesContainer}>
            <Text variant="bold" size="md" color="charcoal" style={styles.popularTitle}>
              Popular Searches
            </Text>
            <View style={styles.popularGrid}>
              {POPULAR_SEARCHES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.popularSearchItem}
                  onPress={() => handlePopularSearch(item)}
                >
                  <Text variant="semibold" size="xs" color="charcoal">
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Matches Dishes Results */}
        {dishes.length > 0 && (
          <View style={styles.section}>
            <Text variant="bold" size="md" color="charcoal" style={styles.sectionTitle}>
              Delicious Dishes
            </Text>
            {dishes.map((dish) => {
              const cartItem = cartItems.find((ci) => ci.menuItem.id === dish.id);
              const qty = cartItem?.quantity || 0;
              const parentRestaurant = RESTAURANTS.find((r) => r.id === dish.restaurantId);

              return (
                <View key={dish.id} style={styles.dishCard}>
                  <Image source={{ uri: dish.imageUrl }} style={styles.dishImage} />
                  <View style={styles.dishDetails}>
                    <View style={styles.dietDotBorder}>
                      <View
                        style={[
                          styles.dietDot,
                          { backgroundColor: dish.dietType === "non-veg" ? "#F44336" : "#4CAF50" },
                        ]}
                      />
                    </View>
                    <Text variant="bold" size="sm" color="charcoal" style={styles.dishName} numberOfLines={1}>
                      {dish.name}
                    </Text>
                    {parentRestaurant && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                          navigation.navigate("HomeStack", {
                            screen: "RestaurantDetail",
                            params: {
                              restaurantId: parentRestaurant.id,
                              name: parentRestaurant.name,
                              price: parentRestaurant.priceRange,
                            },
                          })
                        }
                      >
                        <Text variant="medium" size="xs" color="primary" style={styles.dishRest}>
                          by {parentRestaurant.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <Text variant="bold" size="sm" color="charcoal" style={styles.dishPrice}>
                      ₹{dish.price}
                    </Text>
                  </View>

                  <View style={styles.dishAction}>
                    {qty > 0 ? (
                      <View style={styles.qtyContainer}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(dish.id, qty - 1)}
                        >
                          <Ionicons name="remove" size={12} color={colors.white} />
                        </TouchableOpacity>
                        <Text variant="bold" size="xs" color="white">
                          {qty}
                        </Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(dish.id, qty + 1)}
                        >
                          <Ionicons name="add" size={12} color={colors.white} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addButton}
                        activeOpacity={0.8}
                        onPress={() => addToCart(dish)}
                      >
                        <Text variant="bold" size="xs" color="primary">
                          ADD
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Matches Restaurant Results */}
        {(query || filters.freeDelivery || filters.under30 || filters.topRated) && (
          <View style={styles.section}>
            <Text variant="bold" size="md" color="charcoal" style={styles.sectionTitle}>
              Restaurants
            </Text>
            {restaurants.length > 0 ? (
              restaurants.map((rest) => (
                <RestaurantCard
                  key={rest.id}
                  restaurant={rest}
                  onPress={() =>
                    navigation.navigate("HomeStack", {
                      screen: "RestaurantDetail",
                      params: {
                        restaurantId: rest.id,
                        name: rest.name,
                        price: rest.priceRange,
                      },
                    })
                  }
                />
              ))
            ) : (
              <View style={styles.noResults}>
                <Ionicons name="search-outline" size={40} color={colors.borderGrey} />
                <Text variant="semibold" size="sm" color="mediumGrey" style={styles.noResultsText}>
                  No restaurants matching current filters
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  searchBar: {
    flexDirection: "row",
    height: 48,
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.md,
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    fontSize: 14,
    color: colors.charcoal,
  },
  filtersWrapper: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  filterChipsContainer: {
    paddingHorizontal: spacing.lg,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    height: 32,
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    marginLeft: 4,
  },
  scrollContainer: {
    paddingBottom: spacing.xxl,
  },
  popularSearchesContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  popularTitle: {
    marginBottom: spacing.md,
  },
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  popularSearchItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    marginHorizontal: 4,
    marginBottom: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  dishCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: "center",
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  dishDetails: {
    flex: 1,
  },
  dietDotBorder: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: colors.mediumGrey,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginBottom: 2,
  },
  dietDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dishName: {
    marginBottom: 2,
  },
  dishRest: {
    fontSize: 11,
    marginBottom: 2,
  },
  dishPrice: {
    fontSize: 13,
  },
  dishAction: {
    width: 80,
  },
  addButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    height: 28,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyContainer: {
    backgroundColor: colors.primary,
    height: 28,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  noResults: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  noResultsText: {
    marginTop: spacing.sm,
  },
});