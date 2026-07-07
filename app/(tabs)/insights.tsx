import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import { styled } from "nativewind";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { usePostHog } from "posthog-react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const InsightCard = ({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) => (
  <View className="rounded-3xl bg-card p-4">
    <Text className="text-sm font-sans-semibold text-muted-foreground">
      {label}
    </Text>
    <Text className="mt-3 text-3xl font-sans-bold text-primary">{value}</Text>
    <Text className="mt-2 text-sm font-sans-medium text-muted-foreground">
      {detail}
    </Text>
  </View>
);

const Insights = () => {
  const posthog = usePostHog();
  const totalSpend = HOME_SUBSCRIPTIONS.reduce(
    (total, item) => total + item.price,
    0,
  );
  const activeCount = HOME_SUBSCRIPTIONS.filter(
    (item) => item.status === "active",
  ).length;
  const upcomingCount = UPCOMING_SUBSCRIPTIONS.length;

  useEffect(() => {
    posthog.capture("insights_summary_viewed", {
      total_monthly_spend: totalSpend,
      active_subscription_count: activeCount,
      upcoming_renewal_count: upcomingCount,
    });
  }, [activeCount, posthog, totalSpend, upcomingCount]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="mb-4">
        <Text className="text-2xl font-sans-bold text-primary">Insights</Text>
        <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
          Your subscription spending summary and renewal insights.
        </Text>
      </View>

      <View className="space-y-4">
        <InsightCard
          label="Total monthly spend"
          value={formatCurrency(totalSpend)}
          detail="Total price for all subscriptions in your list"
        />
        <InsightCard
          label="Active subscriptions"
          value={`${activeCount}`}
          detail="Services currently active and renewing"
        />
        <InsightCard
          label="Renewals this week"
          value={`${upcomingCount}`}
          detail="Subscriptions due soon that need your attention"
        />
      </View>

      <View className="mt-6">
        <ListHeading title="Upcoming renewals" />
        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16 }}
          ListEmptyComponent={
            <Text className="home-empty-state">
              No upcoming renewals in your list.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Insights;
