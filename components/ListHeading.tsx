import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ListHeading = ({ title }: { title: string }) => {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>
      <TouchableOpacity className="list-action">
        <Text className="list-action-text">View all</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListHeading;
