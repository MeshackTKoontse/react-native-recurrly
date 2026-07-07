import { Link, router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePostHog } from "posthog-react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import "@/global.css";
import { supabase } from "@/lib/supabase";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpScreen() {
  const posthog = usePostHog();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      setError("Please fill in all fields");
      posthog.capture("auth_sign_up_failed", {
        failure_reason: "missing_required_fields",
      });
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      posthog.capture("auth_sign_up_failed", {
        failure_reason: "password_too_short",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        posthog.capture("auth_sign_up_failed", {
          failure_reason: error.message,
        });
        return;
      }

      posthog.capture("auth_sign_up_succeeded");
      Alert.alert(
        "Account created!",
        "Please check your email to confirm your account.",
      );
      router.replace("/(tabs)");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      posthog.captureException(err as Error);
      posthog.capture("auth_sign_up_failed", {
        failure_reason: "unexpected_error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        style={{ flex: 2 }}
        className="auth-screen"
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 60}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurrly</Text>
                  <Text className="auth-wordmark-sub">Plan with ease</Text>
                </View>
              </View>

              <Text className="auth-title">Create your account</Text>
              <Text className="auth-subtitle">
                Start tracking every renewal and keep your expenses predictable.
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Full name</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="Alex Morgan"
                    placeholderTextColor="#8a8a8a"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="you@example.com"
                    placeholderTextColor="#8a8a8a"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="Create a secure password"
                    placeholderTextColor="#8a8a8a"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                {error && <Text className="auth-error">{error}</Text>}

                <TouchableOpacity
                  className="auth-button"
                  onPress={handleSignUp}
                >
                  {!loading && (
                    <Text className="auth-button-text">Create account</Text>
                  )}
                  {loading && (
                    <Text className="auth-button-text">
                      Creating account...
                    </Text>
                  )}
                </TouchableOpacity>

                <View className="auth-divider-row">
                  <View className="auth-divider-line" />
                  <Text className="auth-divider-text">or</Text>
                  <View className="auth-divider-line" />
                </View>

                <TouchableOpacity
                  onPress={handleSignUp}
                  className="auth-secondary-button"
                >
                  <Text className="auth-secondary-button-text">
                    Sign in instead
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Text className="auth-link">Sign in</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
