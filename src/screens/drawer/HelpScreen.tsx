import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const FAQS = [
  {
    q: "How can I track my food order?",
    a: "Go to your 'Orders' tab and select the active order card. Click 'Track Order' to see your rider James Cooper's real-time position on the visual map overlay.",
  },
  {
    q: "Is there a delivery fee applied?",
    a: "Orders exceeding ₹300 are eligible for Free Delivery. For orders below ₹300, a small nominal fee of ₹19 to ₹49 is applied depending on your distance from the restaurant.",
  },
  {
    q: "What payment methods are supported?",
    a: "We currently support UPI payments (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Cash on Delivery.",
  },
  {
    q: "How can I contact customer support?",
    a: "You can click on the 'Contact Support' button below or write to us directly at support@zaika.com. Our support team is available 24/7.",
  },
];

export default function HelpScreen({ navigation }: NativeStackScreenProps<any>) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text variant="semibold" size="xs" color="primary" style={styles.backText}>
            Back
          </Text>
        </TouchableOpacity>
        <Text variant="bold" size="md" color="charcoal">
          Help & Support
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Support Banner */}
        <View style={styles.supportBanner}>
          <Ionicons name="chatbubbles-outline" size={40} color={colors.primary} />
          <Text variant="bold" size="md" color="charcoal" style={styles.bannerTitle}>
            How can we help you?
          </Text>
          <Text variant="medium" size="xs" color="textGrey" align="center" style={styles.bannerDesc}>
            Check our frequently asked questions below or speak directly to a delivery advisor.
          </Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.sectionHeader}>
          <Text variant="bold" size="sm" color="textGrey">
            FREQUENTLY ASKED QUESTIONS
          </Text>
        </View>

        <View style={styles.faqList}>
          {FAQS.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <TouchableOpacity
                key={index}
                style={styles.faqCard}
                activeOpacity={0.9}
                onPress={() => toggleExpand(index)}
              >
                <View style={styles.faqHeader}>
                  <Text variant="bold" size="sm" color="charcoal" style={styles.faqQuestion}>
                    {faq.q}
                  </Text>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={colors.mediumGrey}
                  />
                </View>
                {isExpanded && (
                  <View style={styles.faqBody}>
                    <Text variant="medium" size="xs" color="textGrey" style={styles.faqAnswer}>
                      {faq.a}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Contact CTA */}
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactBtn} activeOpacity={0.8}>
            <Ionicons name="mail-outline" size={18} color={colors.white} />
            <Text variant="bold" size="sm" color="white" style={styles.contactBtnText}>
              Email Support (support@zaika.com)
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    width: 48,
  },
  backText: {
    marginLeft: 4,
  },
  scrollContainer: {
    paddingBottom: spacing.xxl,
  },
  supportBanner: {
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.xl,
    alignItems: "center",
  },
  bannerTitle: {
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  bannerDesc: {
    lineHeight: 18,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  faqList: {
    paddingHorizontal: spacing.lg,
  },
  faqCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  faqBody: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: spacing.sm,
  },
  faqAnswer: {
    lineHeight: 18,
  },
  contactContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  contactBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  contactBtnText: {
    marginLeft: spacing.sm,
  },
});
