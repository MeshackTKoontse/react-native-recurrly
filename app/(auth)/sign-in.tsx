import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignIn = () => {
  return (
    <View>
      <Link href="/(auth)/sign-up">
        <Text>Don&apos;t have an account? Sign Up</Text>
      </Link>
    </View>
  );
};

export default SignIn;
