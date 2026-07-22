export default {
  expo: {
    name: "recurrly",
    slug: "recurrly",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/logo.png",
    scheme: "recurrly",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.recurrly",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/PlusJakartaSans-Regular.ttf",
            "./assets/fonts/PlusJakartaSans-Bold.ttf",
            "./assets/fonts/PlusJakartaSans-Medium.ttf",
            "./assets/fonts/PlusJakartaSans-SemiBold.ttf",
            "./assets/fonts/PlusJakartaSans-ExtraBold.ttf",
            "./assets/fonts/PlusJakartaSans-Light.ttf",
          ],
        },
      ],
      "expo-secure-store",
      "expo-sqlite",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: "ec6e06a1-c50b-4fa6-a8e1-c3a95739ad1f",
      },
      posthogProjectToken: process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    },
    updates: {
      url: "https://u.expo.dev/ec6e06a1-c50b-4fa6-a8e1-c3a95739ad1f",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
