import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        className="p-4 mt-4 font-sans-semibold bg-primary rounded  text-white"
        href="/Onboarding"
      >
        <Text className="">Get Started</Text>
      </Link>
      <Link
        className="p-4 mt-4 font-sans-semibold bg-primary rounded  text-white"
        href="/(auth)/sign-in"
      >
        <Text className="">Go to Sign in</Text>
      </Link>
      <Link
        className="p-4 mt-4 font-sans-semibold bg-primary rounded  text-white"
        href="/(auth)/sign-up"
      >
        <Text className="">Go to Sign up</Text>
      </Link>
      <Link
        className="p-4 mt-4 font-sans-semibold bg-primary rounded  text-white"
        href="/subscriptions/spotify"
      >
        <Text className="">Go to Sign up</Text>
      </Link>
      <Link
        className="p-4 mt-4 font-sans-semibold bg-primary rounded  text-white"
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude" },
        }}
      >
        <Text className="">Claude Max Subscrioption</Text>
      </Link>
    </View> 
  );
}
