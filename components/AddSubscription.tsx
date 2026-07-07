import { icons } from "@/constants/icons";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import "@/global.css";

type AddSubscriptionProps = {
  onAdd: (subscription: Subscription) => void;
};

const initialForm = {
  name: "",
  price: "",
  billing: "Monthly",
  category: "",
  paymentMethod: "",
  renewalDate: "",
};

export default function AddSubscription({ onAdd }: AddSubscriptionProps) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState(initialForm);

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price.trim()) {
      return;
    }

    const price = Number(form.price);
    if (Number.isNaN(price) || price <= 0) {
      return;
    }

    const newSubscription: Subscription = {
      id: `custom-${Date.now()}`,
      icon: icons.wallet,
      name: form.name.trim(),
      category: form.category.trim() || undefined,
      paymentMethod: form.paymentMethod.trim() || undefined,
      status: "active",
      price,
      currency: "USD",
      billing: form.billing.trim() || "Monthly",
      renewalDate: form.renewalDate.trim() || undefined,
      color: "#fbe9d2",
      startDate: new Date().toISOString(),
    };

    onAdd(newSubscription);
    resetForm();
    setVisible(false);
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
        onRequestClose={() => setVisible(false)}
      >
        <View className="modal-overlay">
          <View className="modal-container">
            <View className="modal-header">
              <View className="flex-1">
                <Text className="modal-title">Add subscription</Text>
                <Text className="auth-helper">
                  Keep your next payment visible before it arrives.
                </Text>
              </View>
              <Pressable
                onPress={() => setVisible(false)}
                className="modal-close"
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView className="modal-body" contentContainerStyle={{ gap: 14 }}>
              <View className="auth-field">
                <Text className="auth-label">Service name</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Spotify, Netflix, etc."
                  placeholderTextColor="#8a8a8a"
                  value={form.name}
                  onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
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
                  onChangeText={(value) => setForm((current) => ({ ...current, price: value }))}
                  keyboardType="decimal-pad"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Billing</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Monthly"
                  placeholderTextColor="#8a8a8a"
                  value={form.billing}
                  onChangeText={(value) => setForm((current) => ({ ...current, billing: value }))}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Entertainment"
                  placeholderTextColor="#8a8a8a"
                  value={form.category}
                  onChangeText={(value) => setForm((current) => ({ ...current, category: value }))}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Payment method</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Visa ending in 4242"
                  placeholderTextColor="#8a8a8a"
                  value={form.paymentMethod}
                  onChangeText={(value) => setForm((current) => ({ ...current, paymentMethod: value }))}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Renewal date</Text>
                <TextInput
                  className="auth-input"
                  placeholder="2026-08-01"
                  placeholderTextColor="#8a8a8a"
                  value={form.renewalDate}
                  onChangeText={(value) => setForm((current) => ({ ...current, renewalDate: value }))}
                />
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleSubmit}
                  className="flex-1 items-center rounded-2xl bg-accent px-4 py-3"
                >
                  <Text className="font-sans-bold text-primary">Save</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    resetForm();
                    setVisible(false);
                  }}
                  className="flex-1 items-center rounded-2xl border border-border bg-background px-4 py-3"
                >
                  <Text className="font-sans-semibold text-primary">Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
