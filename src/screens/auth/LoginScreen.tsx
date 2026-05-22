import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Text } from "../../components/ui/Text";
import { colors, borderRadius, spacing } from "../../constants/theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setErrorMsg("Invalid credentials. Try guest@zaika.com / guest123");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text variant="bold" size="xxxl" color="primary">
              zaika.
            </Text>
            <Text variant="bold" size="xxl" color="charcoal" style={styles.welcomeText}>
              Welcome Back
            </Text>
            <Text variant="regular" size="sm" color="textGrey" style={styles.subtitle}>
              Sign in to continue exploring premium tastes
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {errorMsg ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.primary} />
                <Text variant="medium" size="sm" color="primary" style={styles.errorText}>
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text variant="semibold" size="xs" color="charcoal" style={styles.inputLabel}>
                EMAIL ADDRESS
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.mediumGrey} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.mediumGrey}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text variant="semibold" size="xs" color="charcoal" style={styles.inputLabel}>
                PASSWORD
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.mediumGrey} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.mediumGrey}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.mediumGrey}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text variant="semibold" size="xs" color="primary">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text variant="bold" size="md" color="white">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Toggle */}
          <View style={styles.footer}>
            <Text variant="regular" size="sm" color="textGrey">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text variant="bold" size="sm" color="primary">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: spacing.xxl,
  },
  welcomeText: {
    marginTop: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xs,
    textAlign: "center",
  },
  form: {
    marginVertical: spacing.xl,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(254, 110, 32, 0.08)",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    height: 56,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.charcoal,
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: spacing.xl,
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
  buttonDisabled: {
    opacity: 0.7,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});