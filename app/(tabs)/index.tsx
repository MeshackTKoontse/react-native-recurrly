import AddSubscription from "@/components/AddSubscription";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import images from "@/constants/images";
import "@/global.css";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import subscriptionService from "../services/subscriptionService";

const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  const posthog = usePostHog();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

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

    posthog.capture("home_dashboard_viewed", {
      subscription_count: subscriptions?.length ?? null,
      upcoming_renewal_count: UPCOMING_SUBSCRIPTIONS.length,
      balance_amount: HOME_BALANCE.amount,
    });
  }, [posthog, subscriptions?.length]);

  const handleAddSubscription = async (newSubscription: Subscription) => {
    const currentUser = (await supabase.auth.getUser()).data.user;

    if (!currentUser) {
      alert("You must be logged in");
      return;
    }

    const savedSubscription = await subscriptionService.create(
      currentUser.id,
      newSubscription,
    );

    setSubscriptions((currentSubscriptions) => [
      savedSubscription,
      ...currentSubscriptions,
    ]);
  };

  const handleUpdateSubscription = async (
    updatedSubscription: Subscription,
  ) => {
    await subscriptionService.update(
      updatedSubscription.id,
      updatedSubscription,
    );

    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.map((subscription) =>
        subscription.id === updatedSubscription.id
          ? updatedSubscription
          : subscription,
      ),
    );
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    await subscriptionService.remove(subscriptionId);

    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.filter(
        (subscription) => subscription.id !== subscriptionId,
      ),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>

              <AddSubscription
                onAdd={handleAddSubscription}
                onUpdate={handleUpdateSubscription}
                editingSubscription={editingSubscription}
                onEditComplete={() => setEditingSubscription(null)}
              />
            </View>
            <View className="home-balance-card">
              <Text className="home-balance-label"> Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>
            <View>
              <ListHeading title="Upcoming " />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>
            <ListHeading title="All Subscriptions" />
          </>
        }
        data={subscriptions}
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
            onEdit={() => setEditingSubscription(item)}
            onDelete={() => handleDeleteSubscription(item.id)}
          />
        )}
        extraData={expandedSubscriptionId}
        contentContainerStyle={{ gap: 12 }}
        ListEmptyComponent={
          <Text className="home-empty-state">No Subscriptions yet.</Text>
        }
      />
    </SafeAreaView>
  );
}
