import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { LeftArrow } from "../../assets/icons";
import { image4 } from "../../assets/images";
import { moderateScale } from "../../utils/Scaling";

const Preview = ({ navigation, route }) => {
  const imageData = route.params?.imageData;
  const currentIndex = route.params?.currentIndex;
  const { height, width } = Dimensions.get("window");

  useEffect(() => {
    const lockOrientation = async () => {
      // Lock the orientation to landscape
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    lockOrientation();

    // Clean up the orientation lock on component unmount
    return () => {
      const unlockOrientation = async () => {
        await ScreenOrientation.unlockAsync(); // This will unlock the orientation
      };

      unlockOrientation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.arrowButton}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconStyle}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={image4}
        resizeMode="contain"
        style={{ ...styles.image, height: height, width: "100%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  arrowButton: {
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
    paddingVertical: 20,
    width: "15%",
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  arrowText: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    resizeMode: "cover",
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
  },
});

export default Preview;
