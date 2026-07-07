import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

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

      <View className="rounded-3xl bg-card p-4">
        <Text className="text-lg font-sans-bold text-primary">
          Upcoming renewals
        </Text>
        <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
          Keep track of the next subscriptions that are due.
        </Text>
        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16 }}
        />
      </View>

      <View className="mt-6">
        <ListHeading title="All subscriptions" />
        <FlatList
          data={HOME_SUBSCRIPTIONS}
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
              No subscriptions available.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Subscriptions;
