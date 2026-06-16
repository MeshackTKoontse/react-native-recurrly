import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
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
    </SafeAreaView>
  );
}
