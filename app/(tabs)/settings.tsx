import { useAuth } from "@/app/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { usePostHog } from "posthog-react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SettingRow = ({
  label,
  description,
}: {
  label: string;
  description: string;
}) => (
  <TouchableOpacity className="rounded-3xl bg-card p-4">
    <Text className="text-base font-sans-bold text-primary">{label}</Text>
    <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
      {description}
    </Text>
  </TouchableOpacity>
);

const Settings = () => {
  const posthog = usePostHog();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);

    try {
      posthog.capture("user_signed_out", {
        had_active_session: Boolean(session),
      });
      await supabase.auth.signOut();
      posthog.reset();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      posthog.captureException(err as Error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-5">
        <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
        <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
          Customize your account and app preferences.
        </Text>
      </View>

      <ScrollView
        className="px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, gap: 16 }}
      >
        <View className="rounded-3xl bg-card p-4">
          <Text className="text-lg font-sans-bold text-primary">Account</Text>
          <Text className="mt-2 text-sm font-sans-medium text-muted-foreground">
            {session?.user?.email || "Signed in account"}
          </Text>
          <Text className="mt-4 text-sm font-sans-medium text-muted-foreground">
            Connected member since 2024 with a secure, fast subscription
            overview.
          </Text>
        </View>

        <View className="space-y-3">
          <SettingRow
            label="Notifications"
            description="Receive reminders before renewals and updates"
          />
          <SettingRow
            label="Payment methods"
            description="Manage cards, billing, and saved payment options"
          />
          <SettingRow
            label="Theme"
            description="Switch between light and dark app appearance"
          />
          <SettingRow
            label="Help & support"
            description="View FAQs, contact support, or share feedback"
          />
          <TouchableOpacity className="auth-button" onPress={handleSignOut}>
            {!loading && <Text className="auth-button-text">Sign out</Text>}
            {loading && (
              <Text className="auth-button-text">Signing out...</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
