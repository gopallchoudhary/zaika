import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Cart">;

export default function CartScreen({ navigation }: Props) {
  const { cartItems, addToCart, updateQuantity, cartCount, clearCart } = useCart();

  // Pricing math
  const subtotal = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 30 : 0;
  const taxesAndCharges = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + deliveryFee + taxesAndCharges;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Please add some delicious items to your cart first!");
      return;
    }

    // Mock order placement
    const orderId = `ZK-${Math.floor(100000 + Math.random() * 900000)}`;
    
    Alert.alert(
      "Confirm Order",
      `Would you like to place this order for ₹${total}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            clearCart();
            navigation.replace("TrackOrder", { orderId });
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: typeof cartItems[0] }) => {
    return (
      <View style={styles.itemCard}>
        {item.menuItem.imageUrl ? (
          <Image source={{ uri: item.menuItem.imageUrl }} style={styles.itemImage} />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Ionicons name="restaurant-outline" size={24} color={colors.mediumGrey} />
          </View>
        )}

        <View style={styles.itemDetails}>
          <Text variant="semibold" size="md" color="charcoal" numberOfLines={1}>
            {item.menuItem.name}
          </Text>
          <Text variant="medium" size="sm" color="textGrey" style={styles.cuisineText}>
            {item.menuItem.dietType === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
          </Text>
          <Text variant="bold" size="md" color="primary" style={styles.priceText}>
            ₹{item.menuItem.price}
          </Text>
        </View>

        {/* Quantity Controllers */}
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={16} color={colors.charcoal} />
          </TouchableOpacity>
          <Text variant="bold" size="md" color="charcoal" style={styles.quantityText}>
            {item.quantity}
          </Text>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => addToCart(item.menuItem)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={colors.charcoal} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
        </TouchableOpacity>
        <Text variant="bold" size="lg" color="charcoal">
          My Cart
        </Text>
        <View style={styles.placeholder} />
      </View>

      {cartCount === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={colors.mediumGrey} />
          <Text variant="bold" size="xl" color="charcoal" style={styles.emptyTitle}>
            Your Cart is Empty
          </Text>
          <Text variant="regular" size="md" color="textGrey" align="center" style={styles.emptySubtitle}>
            Browse our curated categories and add some tasty meals to your cart.
          </Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate("Home")}>
            <Text variant="bold" size="md" color="white">
              Shop Now
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.flexContainer}>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.menuItem.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Pricing Panel */}
          <View style={styles.pricePanel}>
            <View style={styles.priceRow}>
              <Text variant="regular" size="md" color="textGrey">
                Subtotal
              </Text>
              <Text variant="semibold" size="md" color="charcoal">
                ₹{subtotal}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text variant="regular" size="md" color="textGrey">
                Delivery Charge
              </Text>
              <Text variant="semibold" size="md" color="charcoal">
                ₹{deliveryFee}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text variant="regular" size="md" color="textGrey">
                Taxes & GST (5%)
              </Text>
              <Text variant="semibold" size="md" color="charcoal">
                ₹{taxesAndCharges}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text variant="bold" size="lg" color="charcoal">
                Total Amount
              </Text>
              <Text variant="bold" size="lg" color="primary">
                ₹{total}
              </Text>
            </View>

            {/* Place Order CTA */}
            <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.8} onPress={handleCheckout}>
              <Text variant="bold" size="lg" color="white">
                Place Order
              </Text>
            </TouchableOpacity>
          </View>
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
  flexContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  backButton: {
    padding: spacing.xs,
  },
  placeholder: {
    width: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    marginTop: spacing.sm,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  shopButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  listContent: {
    padding: spacing.md,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
  },
  itemImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
    backgroundColor: colors.borderGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "center",
  },
  cuisineText: {
    marginTop: 2,
  },
  priceText: {
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.borderGrey,
    borderRadius: borderRadius.md,
    padding: 4,
  },
  controlButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  quantityText: {
    paddingHorizontal: spacing.sm,
  },
  pricePanel: {
    backgroundColor: colors.lightGrey,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    padding: spacing.lg,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGrey,
    marginVertical: spacing.sm,
  },
  totalRow: {
    marginBottom: spacing.lg,
  },
  checkoutButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});