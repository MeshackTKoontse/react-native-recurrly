// services/subscriptionService.js
import { supabase } from "@/lib/supabase";

let subscriptionsCache: Subscription[] = [];

const subscriptionService = {
  // Fetch all
  async getAll() {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    console.log(data);
    if (error) throw error;

    //converting data from snake case to camelCase
    const mapped = (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      name: item.name,
      price: item.price,
      currency: item.currency,
      billing: item.billing,
      category: item.category,
      plan: item.plan,
      color: item.color,
      icon: item.icon,
      startDate: item.start_date,
      renewalDate: item.renewal_date,
      paymentMethod: item.payment_method,
      status: item.status,
      createdAt: item.created_at,
    }));

    subscriptionsCache = mapped;
    return mapped;
  },

  // Insert
  async create(userID: string, subscriptionData: Subscription) {
    const payload = {
      user_id: userID,
      name: subscriptionData.name,
      price: subscriptionData.price,
      currency: subscriptionData.currency || "BWP",
      billing: subscriptionData.billing,
      category: subscriptionData.category,
      plan: subscriptionData.plan,
      color: subscriptionData.color,
      icon: subscriptionData.icon,
      start_date: subscriptionData.startDate,
      renewal_date: subscriptionData.renewalDate,
      payment_method: subscriptionData.paymentMethod,
      status: subscriptionData.status || "active",
    };
    const { data, error } = await supabase
      .from("subscriptions")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    const mappedSubscription = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      price: data.price,
      currency: data.currency,
      billing: data.billing,
      category: data.category,
      plan: data.plan,
      color: data.color,
      icon: data.icon,
      startDate: data.start_date,
      renewalDate: data.renewal_date,
      paymentMethod: data.payment_method,
      status: data.status,
      createdAt: data.created_at,
    } as Subscription;

    subscriptionsCache = [mappedSubscription, ...subscriptionsCache];
    return mappedSubscription;
  },

  // Update
  async update(id: string, updates: Subscription) {
    //converting datd from camelCase to snakeCAse
    const payload = {
      name: updates.name,
      price: updates.price,
      currency: updates.currency || "BWP",
      billing: updates.billing,
      category: updates.category,
      plan: updates.plan,
      color: updates.color,
      icon: updates.icon,
      start_date: updates.startDate,
      renewal_date: updates.renewalDate,
      payment_method: updates.paymentMethod,
      status: updates.status || "active",
    };
    const { error } = await supabase
      .from("subscriptions")
      .update(payload)
      .eq("id", id);

    if (error) throw error;

    subscriptionsCache = subscriptionsCache.map((item) =>
      item.id === id ? ({ ...item, ...updates } as Subscription) : item,
    );
  },

  // Delete
  async remove(id: string) {
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    subscriptionsCache = subscriptionsCache.filter((item) => item.id !== id);
  },
  getCached() {
    return subscriptionsCache;
  },
};

export default subscriptionService;
