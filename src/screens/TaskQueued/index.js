import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Orientation from "react-native-orientation-locker";
import { Timer } from "../../components";
import { moderateScale } from "../../utils/Scaling";

const TaskQueued = ({ navigation, route }) => {
  const numberPlate = route.params?.numberPlate;
  const collectionTemplate = route.params?.collectionTemplate;
  const [orientation, setOrientation] = useState(null);

  const determineAndSetOrientation = () => {
    let width = Dimensions.get("window").width;
    let height = Dimensions.get("window").height;

    if (width < height) {
      setOrientation("PORTRAIT");
    } else {
      setOrientation("LANDSCAPE");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      determineAndSetOrientation();
    }, 1000);
  }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      // Optionally introduce a delay if needed
      setTimeout(() => {
        Orientation.lockToPortrait();
        determineAndSetOrientation();
      }, 100); // Delay for 100 milliseconds, adjust as necessary
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      determineAndSetOrientation();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const isLandscape = orientation === "LANDSCAPE";

  return (
    <View style={styles.container}>
      <View style={{ ...styles.firstContainer, flex: isLandscape ? 0 : 0.6 }}>
        <Text
          style={{
            ...styles.qadoneTxt,
            fontSize: isLandscape ? moderateScale(26) : moderateScale(30),
          }}
        >
          Task Queued
        </Text>
        <Timer totalTime={1200} />
        <Text style={styles.vehicleTxt}>{numberPlate}</Text>
        {/* <Text style={styles.noTxt}>{collectionTemplate}</Text> */}
        <View
          style={{
            ...styles.hintContainer,
            padding: isLandscape ? 5 : 10,
            marginVertical: isLandscape ? 10 : 20,
          }}
        >
          <Text
            style={{
              ...styles.hintTxt,
              fontSize: isLandscape ? moderateScale(10) : moderateScale(14),
            }}
          >
            Hint
          </Text>
          <Text
            style={{
              ...styles.hintDesc,
              fontSize: isLandscape ? moderateScale(8) : moderateScale(10),
            }}
          >
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
          <Text
            style={{
              ...styles.goBackTxt,
              padding: isLandscape ? 10 : 20,
              fontSize: isLandscape ? moderateScale(14) : moderateScale(16),
            }}
          >
            Go back to home
          </Text>
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
