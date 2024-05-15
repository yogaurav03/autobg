import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Accelerometer } from "expo-sensors";
import { LinearGradient } from "expo-linear-gradient";

const Leveler = ({ setIsCentered }) => {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    Accelerometer.setUpdateInterval(16);
    const subscription = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);
    });

    return () => subscription.remove();
  }, []);

  // Determine leveler position based on accelerometer data
  const { height } = Dimensions.get("window");
  // Assuming y-axis for simplicity; accelerometer data range is from -1 to 1
  const levelerPosition = ((data.y + 1) / 2) * height;
  const centerOfScreen = height / 2;
  const tolerance = 5;

  useEffect(() => {
    setIsCentered(Math.abs(levelerPosition - centerOfScreen) <= tolerance);
  }, [levelerPosition, centerOfScreen, tolerance]);

  return (
    <View style={styles.levelerContainer}>
      <View style={styles.levelerVerticalLine}>
        <LinearGradient
          // The colors are set from transparent to semi-transparent and back to transparent
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
