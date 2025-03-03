import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Orientation from "react-native-orientation-locker";
import { TickIcon } from "../../assets/icons";
import { moderateScale } from "../../utils/Scaling";

const QADone = ({ navigation, route }) => {
  const historyData = route.params?.historyData;
  const numberPlate = historyData?.collectionData?.numberPlate;
  const collectionTemplate = historyData?.collectionData?.collectionTemplate;

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      Orientation.lockToLandscape();
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      Orientation.unlockAllOrientations(); // Adjust if you want a default portrait when leaving
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.qadoneTxt}>Q&A Done</Text>
      <View style={styles.tickContainer}>
        <TickIcon width={30} />
      </View>
      <Text style={styles.vehicleTxt}>{numberPlate}</Text>
      {/* <Text style={styles.noTxt}>{collectionTemplate}</Text> */}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainScreen")}
          style={styles.goBackContainer}
        >
          <Text style={styles.goBackTxt}>Go back to home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TaskQueuedScreen", {
              numberPlate: numberPlate,
              collectionTemplate: collectionTemplate,
            })
          }
          style={{ ...styles.goBackContainer, backgroundColor: "#2492FE" }}
        >
          <Text style={styles.goBackTxt}>Resubmit for correction</Text>
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
    width: "100%",
  },
  tickContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    backgroundColor: "#EEF9FF",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  qadoneTxt: {
    color: "#8AEB0F",
    fontSize: moderateScale(20),
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
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  goBackContainer: {
    backgroundColor: "#B1C9EE",
    borderRadius: 30,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  goBackTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(16),
    padding: 20,
  },
});

export default QADone;
