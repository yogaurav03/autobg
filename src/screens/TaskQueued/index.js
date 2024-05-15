import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { Timer } from "../../components";
import { moderateScale } from "../../utils/Scaling";

const TaskQueued = ({ navigation }) => {
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      // Optionally introduce a delay if needed
      setTimeout(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }, 100); // Delay for 100 milliseconds, adjust as necessary
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      ScreenOrientation.unlockAsync();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.firstContainer}>
        <Text style={styles.qadoneTxt}>Task Queued</Text>
        <Timer totalTime={900} />
        <Text style={styles.vehicleTxt}>Mazda Rx7</Text>
        <Text style={styles.noTxt}>225Mb</Text>
        <View style={styles.hintContainer}>
          <Text style={styles.hintTxt}>Hint</Text>
          <Text style={styles.hintDesc}>
            Your task has been queued, we will notify you as soon as its done,
            make sure the app have permissions to push notifications
          </Text>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainScreen")}
          style={styles.goBackContainer}
        >
          <Text style={styles.goBackTxt}>Go back to home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#EAF7FF",
  },
  firstContainer: {
    flex: 0.6,
    alignItems: "center",
  },
  qadoneTxt: {
    color: "#8AEB0F",
    fontSize: moderateScale(30),
    fontWeight: "bold",
    marginVertical: 10,
  },
  vehicleTxt: {
    color: "#8A93A4",
    fontWeight: "700",
    fontSize: moderateScale(16),
    marginVertical: 5,
  },
  noTxt: {
    color: "#2499DA",
    fontSize: moderateScale(10),
  },
  btnContainer: {
    width: "80%",
    justifyContent: "space-around",
  },
  goBackContainer: {
    backgroundColor: "#2499DA",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  goBackTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(16),
    padding: 20,
  },
  hintContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C7EAFF",
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
  hintTxt: {
    color: "#8A93A4",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
  hintDesc: {
    color: "#8A93A4",
    fontSize: moderateScale(12),
    textAlign: "center",
  },
});

export default TaskQueued;
