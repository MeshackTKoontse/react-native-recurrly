import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const apiKey = Constants.expoConfig?.extra?.posthogProjectToken as
  | string
  | undefined;
const host = Constants.expoConfig?.extra?.posthogHost as string | undefined;
const isPostHogConfigured = Boolean(apiKey && host);

export const posthog = new PostHog(apiKey || "disabled", {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  requestTimeout: 10000,
  featureFlagsRequestTimeoutMs: 10000,
});

export const isPostHogEnabled = isPostHogConfigured;
