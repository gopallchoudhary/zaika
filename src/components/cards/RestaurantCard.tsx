import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { Restaurant } from "../../data/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
        {restaurant.tags && restaurant.tags.length > 0 && (
          <View style={styles.tagBadge}>
            <Text variant="bold" size="xs" color="white">
              {restaurant.tags[0]}
            </Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text variant="bold" size="xs" color="charcoal" style={styles.ratingText}>
            {restaurant.rating}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text variant="bold" size="md" color="charcoal" numberOfLines={1} style={styles.name}>
            {restaurant.name}
          </Text>
          <Text variant="semibold" size="xs" color="primary">
            {restaurant.priceRange}
          </Text>
        </View>

        <Text variant="medium" size="xs" color="textGrey" numberOfLines={1} style={styles.cuisine}>
          {restaurant.cuisine}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color={colors.mediumGrey} />
            <Text variant="medium" size="xs" color="textGrey" style={styles.infoText}>
              {restaurant.deliveryTime}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Ionicons name="bicycle-outline" size={14} color={colors.mediumGrey} />
            <Text variant="medium" size="xs" color="textGrey" style={styles.infoText}>
              {restaurant.deliveryFee === 0 ? "Free Delivery" : `₹${restaurant.deliveryFee}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tagBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  ratingBadge: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingText: {
    marginLeft: 4,
  },
  detailsContainer: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cuisine: {
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: spacing.sm,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 4,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.borderGrey,
    marginHorizontal: spacing.md,
  },
});

export default RestaurantCard;
