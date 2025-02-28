import React from "react";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import NetworkLogger from "react-native-network-logger";

const styles = {
  backButton: {
    borderRadius: 180,
    backgroundColor: "lightblue",
    height: 36,
    width: 36,
    zIndex: 1000,
    position: "absolute",
    bottom: 130,
    left: 4,
    alignItems: "center",
    justifyContent: "center",
  },
};

const NetworkLoggerScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <NetworkLogger />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={{ textAlign: "center", color: "black", fontSize: 10 }}>
          Back
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NetworkLoggerScreen;
