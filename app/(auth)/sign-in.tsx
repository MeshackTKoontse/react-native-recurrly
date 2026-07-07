import { Link, router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import "@/global.css";
import { supabase } from "@/lib/supabase";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Success - navigate to main app
      router.replace("/(tabs)");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
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
                  <Text className="auth-wordmark-sub">Stay on top</Text>
                </View>
              </View>

              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to keep your subscriptions organized and under control.
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
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
                    placeholder="Enter your password"
                    placeholderTextColor="#8a8a8a"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                {error && <Text className="auth-error">{error}</Text>}
                <TouchableOpacity
                  className="auth-button"
                  onPress={handleSignIn}
                >
                  {!loading && <Text>Sign in</Text>}
                  {loading && (
                    <Text className="auth-button-text">Signing in...</Text>
                  )}
                </TouchableOpacity>

                <View className="auth-divider-row">
                  <View className="auth-divider-line" />
                  <Text className="auth-divider-text">or</Text>
                  <View className="auth-divider-line" />
                </View>

                <Link href="/(auth)/sign-up" asChild>
                  <TouchableOpacity className="auth-secondary-button">
                    <Text className="auth-secondary-button-text">
                      Create an account
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">New here?</Text>
              <Link href="/(auth)/sign-up" asChild>
                {!loading && <Text className="auth-link">Sign up</Text>}
                {loading && <Text className="auth-link">Signing up...</Text>}
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
