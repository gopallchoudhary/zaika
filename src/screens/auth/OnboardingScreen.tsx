import React from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

const { width } = Dimensions.get("window");

export default function OnboardingScreen({ navigation }: Props) {
  const { completeOnboarding } = useAuth();

  const handleGetStarted = async () => {
    await completeOnboarding();
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Brand Name / Logo */}
        <View style={styles.header}>
          <Text variant="bold" size="xxxl" color="primary">
            zaika.
          </Text>
          <Text variant="medium" size="xs" color="textGrey">
            Premium Taste Delivery
          </Text>
        </View>

        {/* Hero Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.gradient} />
        </View>

        {/* Dynamic Marketing Text */}
        <View style={styles.textContainer}>
          <Text variant="bold" size="xxxl" align="center" color="charcoal" style={styles.title}>
            Get Delicious Food{"\n"}Delivered in Minutes
          </Text>
          <Text variant="regular" size="md" align="center" color="textGrey" style={styles.description}>
            Craving your favorite meals? Zaika brings the finest restaurants right to your doorstep with lightning-fast delivery.
          </Text>
        </View>

        {/* Dot Indicators */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleGetStarted}>
          <Text variant="bold" size="lg" color="white">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  imageContainer: {
    width: width - spacing.xl * 2,
    height: width - spacing.xl * 2,
    borderRadius: borderRadius.xxl,
    overflow: "hidden",
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginVertical: spacing.md,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(30, 28, 26, 0.05)",
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    lineHeight: 36,
  },
  description: {
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderGrey,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  button: {
    width: "100%",
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