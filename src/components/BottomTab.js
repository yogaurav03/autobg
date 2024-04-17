import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  ActiveHomeIcon,
  ActiveProfileIcon,
  CaptureIcon,
  InactiveHomeIcon,
  InactiveProfileIcon,
} from "../assets/icons";
import { useAppState } from "../context/AppStateContext";
import { useNavigation } from "@react-navigation/native";
import { moderateScale } from "../utils/Scaling";

const BottomTab = () => {
  const { state, dispatch } = useAppState();
  const navigation = useNavigation();
  const handleContent = (val) => {
    dispatch({ type: "MAIN_CONTENT", payload: val });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleContent("HomeScreen")}
        style={styles.tabButton}
      >
        {state?.mainContent === "HomeScreen" ? (
          <ActiveHomeIcon />
        ) : (
          <InactiveHomeIcon />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SelectProcessTypeScreen")}
        style={styles.captureButton}
      >
        <View style={styles.circleButton}>
          <CaptureIcon width={70} height={70} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleContent("ProfileScreen")}
        style={styles.tabButton}
      >
        {state?.mainContent === "ProfileScreen" ? (
          <ActiveProfileIcon />
        ) : (
          <InactiveProfileIcon />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // For Android
    paddingVertical: 20,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    width: "90%",
    alignSelf: "center",
  },
  tabButton: {
    flex: 0.4,
    alignItems: "center",
  },
  tabText: {
    fontSize: moderateScale(16),
    color: "#2c3e50", // Dark Grey color
  },
  captureButton: {
    backgroundColor: "transparent",
    position: "absolute",
    top: -20,
    left: "40%",
    alignSelf: "center",
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#3498db", // Blue color
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#C7EAFF",
  },
  captureText: {
    fontSize: moderateScale(12),
    color: "white",
  },
});

export default BottomTab;
