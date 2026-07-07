import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { usePostHog } from "posthog-react-native";

const SubscriptionDetails = () => {
  const posthog = usePostHog();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      posthog.capture("subscription_details_viewed", {
        has_subscription_id: true,
      });
    }
  }, [id, posthog]);

  return (
    <View>
      <Text>SubscriptionDetails {id}</Text>
      <Link href="/">Go back</Link>
    </View>
  );
};

export default SubscriptionDetails;
