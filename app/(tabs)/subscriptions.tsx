import SubscriptionCard from "@/components/SubscriptionCard";
import { UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { subscriptionService } from "../services/subscriptionService";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const posthog = usePostHog();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[] | []>([]);

  useEffect(() => {
    let isMounted = true;

    const loadSubscriptions = async () => {
      try {
        const data = await subscriptionService.getAll();
        if (isMounted) {
          setSubscriptions(data || []);
        }
      } catch (error) {
        console.error("failed to load subs", error);
        if (isMounted) {
          setSubscriptions([]);
        }
      }
    };

    loadSubscriptions();

    const subscriptionSync = setInterval(() => {
      if (isMounted) {
        setSubscriptions(subscriptionService.getCached());
      }
    }, 500);

    posthog.capture("subscriptions_overview_viewed", {
      subscription_count: subscriptions.length,
      upcoming_renewal_count: UPCOMING_SUBSCRIPTIONS.length,
    });

    return () => {
      isMounted = false;
      clearInterval(subscriptionSync);
    };
  }, [posthog, subscriptions.length]);

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return [
      subscription.name,
      subscription.category,
      subscription.plan,
      subscription.paymentMethod,
    ]
      .filter(Boolean)
      .some((value) => value?.toLowerCase().includes(query));
  });

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="mb-4">
        <Text className="text-2xl font-sans-bold text-primary">
          Subscriptions
        </Text>
        <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
          See all your recurring plans and upcoming renewals in one place.
        </Text>
      </View>

      <View className="mt-4">
        <TextInput
          className="rounded-2xl border border-border bg-card px-4 py-3 text-base font-sans-medium text-primary"
          placeholder="Search subscriptions"
          placeholderTextColor="#8a8a8a"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View className="mt-6">
        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() =>
                setExpandedSubscriptionId((currentId) =>
                  currentId === item.id ? null : item.id,
                )
              }
            />
          )}
          extraData={expandedSubscriptionId}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">
              No subscriptions match your search.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Subscriptions;
