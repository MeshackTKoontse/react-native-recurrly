import { icons } from "@/constants/icons";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import "@/global.css";

type AddSubscriptionProps = {
  onAdd: (subscription: Subscription) => void;
  onUpdate?: (subscription: Subscription) => void;
  editingSubscription?: Subscription | null;
  onEditComplete?: () => void;
};

const initialForm = {
  name: "",
  price: "",
  frequency: "Monthly" as "Monthly" | "Yearly",
  category: "" as string,
};

const categoryOptions = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const categoryColors: Record<string, string> = {
  Entertainment: "#fce7d6",
  "AI Tools": "#dfe7ff",
  "Developer Tools": "#e8def8",
  Design: "#f9e6bc",
  Productivity: "#dff2e8",
  Cloud: "#dcecfb",
  Music: "#f6d8e6",
  Other: "#efe7d6",
};

export default function AddSubscription({
  onAdd,
  onUpdate,
  editingSubscription,
  onEditComplete,
}: AddSubscriptionProps) {
  const posthog = usePostHog();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ ...initialForm });
  };

  useEffect(() => {
    if (editingSubscription) {
      setForm({
        name: editingSubscription.name ?? "",
        price: editingSubscription.price?.toString() ?? "",
        frequency:
          editingSubscription.billing === "Yearly" ? "Yearly" : "Monthly",
        category: editingSubscription.category ?? "",
      });
      setVisible(true);
      return;
    }

    if (!visible) {
      resetForm();
    }
  }, [editingSubscription, visible]);

  const closeModal = () => {
    setVisible(false);
    resetForm();
    onEditComplete?.();
  };

  const handleSubmit = async () => {
    const trimmedName = form.name.trim();
    const priceValue = Number(form.price);

    if (!trimmedName || Number.isNaN(priceValue) || priceValue <= 0) {
      return;
    }

    setIsSubmitting(true);

    const startDate = editingSubscription?.startDate ?? dayjs().toISOString();
    const renewDate =
      form.frequency === "Yearly"
        ? dayjs().add(1, "year").toISOString()
        : dayjs().add(1, "month").toISOString();

    const trimmedCategory = form.category.trim();

    const subscriptionToSave: Subscription = {
      ...(editingSubscription ?? {}),
      id: editingSubscription?.id ?? `custom-${Date.now()}`,
      icon: editingSubscription?.icon ?? icons.wallet,
      name: trimmedName,
      category: trimmedCategory || undefined,
      status: "active",
      price: priceValue,
      currency: "USD",
      billing: form.frequency,
      renewalDate: renewDate,
      color:
        categoryColors[trimmedCategory] ||
        editingSubscription?.color ||
        "#fbe9d2",
      startDate,
    };

    try {
      if (editingSubscription) {
        await Promise.resolve(onUpdate?.(subscriptionToSave));
        posthog.capture("subscription_updated", {
          category: trimmedCategory || "uncategorized",
          billing_period: form.frequency.toLowerCase(),
          price: priceValue,
          currency: subscriptionToSave.currency ?? null,
        });
        Alert.alert("Updated", "Subscription updated successfully.");
      } else {
        const optimisticSubscription = {
          ...subscriptionToSave,
          id: subscriptionToSave.id,
        };
        onAdd(optimisticSubscription);
        posthog.capture("subscription_added", {
          category: trimmedCategory || "uncategorized",
          billing_period: form.frequency.toLowerCase(),
          price: priceValue,
          currency: subscriptionToSave.currency ?? null,
        });
        Alert.alert("Success", "Subscription added successfully.");
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save subscription", error);
      Alert.alert(
        "Error",
        "We couldn't save this subscription. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="items-center justify-center rounded-full border border-accent/20 bg-accent/10 p-2"
      >
        <Image source={icons.add} className="size-6" />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="modal-overlay">
          <KeyboardAvoidingView
            className="flex-1 justify-end"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View className="modal-container">
              <View className="modal-header">
                <View className="flex-1">
                  <Text className="modal-title">
                    {editingSubscription
                      ? "Edit subscription"
                      : "Add subscription"}
                  </Text>
                  <Text className="auth-helper">
                    Keep your next payment visible before it arrives.
                  </Text>
                </View>
                <Pressable onPress={closeModal} className="modal-close">
                  <Text className="modal-close-text">×</Text>
                </Pressable>
              </View>

              <ScrollView
                className="modal-body"
                contentContainerStyle={{ gap: 14 }}
              >
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="Spotify, Netflix, etc."
                    placeholderTextColor="#8a8a8a"
                    value={form.name}
                    onChangeText={(value) =>
                      setForm((current) => ({ ...current, name: value }))
                    }
                    autoCapitalize="words"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Price</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="9.99"
                    placeholderTextColor="#8a8a8a"
                    value={form.price}
                    onChangeText={(value) =>
                      setForm((current) => ({ ...current, price: value }))
                    }
                    keyboardType="decimal-pad"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Frequency</Text>
                  <View className="picker-row">
                    {(["Monthly", "Yearly"] as const).map((option) => (
                      <Pressable
                        key={option}
                        onPress={() =>
                          setForm((current) => ({
                            ...current,
                            frequency: option,
                          }))
                        }
                        className={clsx(
                          "picker-option",
                          form.frequency === option && "picker-option-active",
                        )}
                      >
                        <Text
                          className={clsx(
                            "font-sans-semibold text-primary",
                            form.frequency === option && "text-accent",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {categoryOptions.map((option) => {
                      const isActive = form.category === option;

                      return (
                        <Pressable
                          key={option}
                          onPress={() =>
                            setForm((current) => ({
                              ...current,
                              category: option,
                            }))
                          }
                          className={clsx(
                            "rounded-full border border-border px-3 py-2",
                            isActive
                              ? "border-accent bg-accent/15"
                              : "bg-background",
                          )}
                        >
                          <Text
                            className={clsx(
                              "text-sm font-sans-semibold",
                              isActive ? "text-accent" : "text-primary",
                            )}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <Pressable
                    onPress={closeModal}
                    className="flex-1 items-center rounded-2xl border border-border bg-background px-4 py-3"
                  >
                    <Text className="font-sans-semibold text-primary">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    className={clsx(
                      "flex-1 items-center justify-center rounded-2xl bg-accent px-4 py-3",
                      !form.name.trim() ||
                        Number.isNaN(Number(form.price)) ||
                        Number(form.price) <= 0 ||
                        isSubmitting
                        ? "auth-button-disabled"
                        : "",
                    )}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="font-sans-bold text-primary">
                        {editingSubscription ? "Update" : "Save"}
                      </Text>
                    )}
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}
