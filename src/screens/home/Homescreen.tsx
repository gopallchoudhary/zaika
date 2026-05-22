import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { CompositeNavigationProp } from "@react-navigation/native";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { RESTAURANTS } from "../../data/restaurants";
import { RestaurantCard } from "../../components/cards/RestaurantCard";
import { HomeStackParamList } from "../../navigation/types";

// Categorize items
const CATEGORIES = [
  { id: "All", name: "All", icon: "grid-outline" },
  { id: "Burgers", name: "Burgers", icon: "fast-food-outline" },
  { id: "Indian", name: "Indian", icon: "restaurant-outline" },
  { id: "Pizza", name: "Pizza", icon: "pizza-outline" },
  { id: "Asian", name: "Asian", icon: "flame-outline" },
  { id: "Healthy", name: "Healthy", icon: "leaf-outline" },
  { id: "Biryani", name: "Biryani", icon: "sparkles-outline" },
  { id: "Desserts", name: "Desserts", icon: "ice-cream-outline" },
];

type NavigationProp = CompositeNavigationProp<
  NativeStackScreenProps<HomeStackParamList, "Home">["navigation"],
  DrawerNavigationProp<any>
>;

type Props = {
  navigation: NavigationProp;
};

export default function Homescreen({ navigation }: Props) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Resolve user address label
  const defaultAddressObj = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const userLocationLabel = defaultAddressObj
    ? `${defaultAddressObj.label} - ${defaultAddressObj.line1.split(",")[0]}`
    : "Select Location";

  // Filter restaurants
  const filteredRestaurants = RESTAURANTS.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "All") return matchesSearch;
    
    const matchesCategory = r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase()) || 
      r.tags.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  const featuredRestaurants = filteredRestaurants.filter((r) => r.isFeatured);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.menuBtn}
            activeOpacity={0.7}
            onPress={() => (navigation as any).openDrawer?.()}
          >
            <Ionicons name="menu-outline" size={24} color={colors.charcoal} />
          </TouchableOpacity>
          <View style={styles.locationContainer}>
            <Text variant="semibold" size="xs" color="textGrey">
              DELIVER TO
            </Text>
            <View style={styles.locationSubRow}>
              <Ionicons name="location" size={14} color={colors.primary} />
              <Text variant="bold" size="sm" color="charcoal" style={styles.locationText} numberOfLines={1}>
                {userLocationLabel}
              </Text>
              <Ionicons name="chevron-down" size={12} color={colors.primary} />
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate("Profile" as any)}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={20} color={colors.mediumGrey} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* User Greeting */}
        <View style={styles.greetingSection}>
          <Text variant="bold" size="xl" color="charcoal">
            Hey {user?.name.split(" ")[0] || "there"}, 👋
          </Text>
          <Text variant="medium" size="sm" color="textGrey" style={styles.greetingSubtitle}>
            What are you craving today?
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.mediumGrey} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes, restaurants..."
              placeholderTextColor={colors.mediumGrey}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color={colors.mediumGrey} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate("Search" as any)}>
            <Ionicons name="options-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* 20% OFF Promo Card */}
        <TouchableOpacity style={styles.promoCard} activeOpacity={0.95}>
          <View style={styles.promoTextContainer}>
            <Text variant="bold" size="xl" color="white" style={styles.promoTitle}>
              Get 20% OFF
            </Text>
            <Text variant="semibold" size="xs" color="white" style={styles.promoSubtitle}>
              On your first order today!
            </Text>
            <View style={styles.promoCodeBadge}>
              <Text variant="bold" size="xs" color="primary">
                CODE: ZAIKA20
              </Text>
            </View>
          </View>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" }}
            style={styles.promoImage}
          />
        </TouchableOpacity>

        {/* Category Selector */}
        <View style={styles.sectionHeader}>
          <Text variant="bold" size="lg" color="charcoal">
            Categories
          </Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(item.id)}
              >
                <View style={[styles.categoryIconContainer, isSelected && styles.categoryIconContainerSelected]}>
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={isSelected ? colors.white : colors.charcoal}
                  />
                </View>
                <Text
                  variant="bold"
                  size="xs"
                  color={isSelected ? "white" : "charcoal"}
                  style={styles.categoryText}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Featured Section */}
        {featuredRestaurants.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text variant="bold" size="lg" color="charcoal">
                Featured Restaurants
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={featuredRestaurants}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.featuredList}
              renderItem={({ item }) => (
                <View style={styles.featuredWrapper}>
                  <RestaurantCard
                    restaurant={item}
                    onPress={() =>
                      navigation.navigate("RestaurantDetail", {
                        restaurantId: item.id,
                        name: item.name,
                        price: item.priceRange,
                      })
                    }
                  />
                </View>
              )}
            />
          </>
        )}

        {/* All Restaurants List */}
        <View style={styles.sectionHeader}>
          <Text variant="bold" size="lg" color="charcoal">
            {selectedCategory === "All" ? "All Restaurants" : `${selectedCategory} Specialities`}
          </Text>
          <Text variant="medium" size="xs" color="textGrey">
            {filteredRestaurants.length} found
          </Text>
        </View>

        {filteredRestaurants.length > 0 ? (
          <View style={styles.verticalList}>
            {filteredRestaurants.map((item) => (
              <RestaurantCard
                key={item.id}
                restaurant={item}
                onPress={() =>
                  navigation.navigate("RestaurantDetail", {
                    restaurantId: item.id,
                    name: item.name,
                    price: item.priceRange,
                  })
                }
              />
            ))}
          </View>
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="restaurant-outline" size={48} color={colors.borderGrey} />
            <Text variant="semibold" size="md" color="mediumGrey" style={styles.noResultsText}>
              No restaurants matching criteria
            </Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  locationContainer: {
    flex: 1,
  },
  locationSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationText: {
    marginHorizontal: 4,
    maxWidth: "80%",
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarPlaceholder: {
    backgroundColor: colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: spacing.xxl,
  },
  greetingSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  greetingSubtitle: {
    marginTop: 4,
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    height: 48,
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.md,
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
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
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  promoCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  promoTextContainer: {
    flex: 1.2,
    zIndex: 2,
  },
  promoTitle: {
    lineHeight: 28,
  },
  promoSubtitle: {
    marginTop: 4,
    opacity: 0.9,
  },
  promoCodeBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginTop: spacing.md,
  },
  promoImage: {
    width: 120,
    height: 120,
    position: "absolute",
    right: -10,
    bottom: -10,
    zIndex: 1,
    opacity: 0.85,
    borderRadius: borderRadius.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  categoryList: {
    paddingHorizontal: spacing.lg,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
    height: 40,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  categoryCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  categoryIconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryText: {
    marginLeft: 2,
  },
  featuredList: {
    paddingHorizontal: spacing.lg,
  },
  featuredWrapper: {
    width: 280,
    marginRight: spacing.md,
  },
  verticalList: {
    paddingHorizontal: spacing.lg,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
  },
  noResultsText: {
    marginTop: spacing.md,
  },
});