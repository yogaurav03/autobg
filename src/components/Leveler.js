import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useDeviceOrientation } from "@react-native-community/hooks";
import LinearGradient from "react-native-linear-gradient";
import {
  setUpdateIntervalForType,
  SensorTypes,
  accelerometer,
} from "react-native-sensors";

const Leveler = ({ setIsCentered }) => {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [filteredData, setFilteredData] = useState({ x: 0, y: 0, z: 0 });
  const ALPHA = 0.3; // Low-pass filter constant (adjust for sensitivity)

  const screenOrientation = useDeviceOrientation();
  const [orientation, setOrientation] = useState(screenOrientation);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 16);

    const observer = {
      next: (accelerometerData) => {
        setData(accelerometerData);

        // Apply low-pass filter
        setFilteredData((prev) => ({
          x: prev.x + ALPHA * (accelerometerData.x - prev.x),
          y: prev.y + ALPHA * (accelerometerData.y - prev.y),
          z: prev.z + ALPHA * (accelerometerData.z - prev.z),
        }));
      },
      error: (error) => console.error("Error with accelerometer:", error),
    };

    const subscription = accelerometer.subscribe(observer);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { height } = Dimensions.get("window");
  const levelerPosition = ((filteredData.y + 1) / 2.3) * height;
  const centerOfScreen = height / 2.3;
  const tolerance = 40;

  useEffect(() => {
    const isHeldUp = Math.abs(filteredData.z) < 0.3;
    const isCentered = Math.abs(levelerPosition - centerOfScreen) <= tolerance;

    if (screenOrientation === "landscape" && isHeldUp && isCentered) {
      setIsCentered(true);
    } else {
      setIsCentered(false);
    }
  }, [levelerPosition, centerOfScreen, tolerance, orientation, filteredData]);

  return (
    <View style={styles.levelerContainer}>
      <View style={styles.levelerVerticalLine}>
        <LinearGradient
          colors={["transparent", "#38EF76", "transparent"]}
          style={styles.levelerGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      <View style={[styles.levelerCircle, { top: levelerPosition }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  levelerContainer: {
    position: "absolute",
    right: "22%",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  levelerVerticalLine: {
    position: "absolute",
    width: 15,
    height: "40%",
    borderRadius: 10,
    borderColor: "#FFFFFF",
    borderWidth: 0.2,
    overflow: "hidden",
  },
  levelerGradient: {
    width: "100%",
    height: "100%",
  },
  levelerCircle: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: "#6DC300",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
});

export default Leveler;
