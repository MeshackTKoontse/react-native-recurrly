import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignUp = () => {
  return (
    <View>
      <Link href="/(auth)/sign-in">
        <Text>Already have an account? Sign In</Text>
      </Link>
      <Text>SignUp</Text>
    </View>
  );
};

export default SignUp;
