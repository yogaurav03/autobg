import { View } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native-paper";

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 1,
      }}
    >
      <ActivityIndicator size="large" color="#EAF7FF" />
    </View>
  );
};

export default Loader;
