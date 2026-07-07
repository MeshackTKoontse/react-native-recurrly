// services/subscriptionService.js
import { supabase } from "@/lib/supabase";

export const subscriptionService = {
  // Fetch all
  async getAll() {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("renewal_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Insert
  async create(subscriptionData: Subscription) {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert(subscriptionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update
  async update(id: string, updates: Subscription) {
    const { error } = await supabase
      .from("subscriptions")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
  },

  // Delete
  async remove(id: string) {
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
