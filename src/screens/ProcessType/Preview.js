import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Orientation from "react-native-orientation-locker";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";

import { LeftArrow } from "../../assets/icons";

const Preview = ({ navigation, route }) => {
  const imageData = route.params?.imageData;

  useEffect(() => {
    // Lock orientation to landscape when screen is focused
    const unsubscribeFocus = navigation.addListener("focus", () => {
      Orientation.lockToLandscape();
    });

    // Unlock or keep landscape when screen is blurred
    const unsubscribeBlur = navigation.addListener("blur", () => {
      Orientation.lockToPortrait(); // Adjust if you want a default portrait when leaving
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconStyle}
        >
          <LeftArrow />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* <Image
        source={{ uri: imageData }}
        resizeMode="contain"
        style={styles.image}
      /> */}
      <ImageZoom uri={imageData} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Background color to give a better viewing experience
  },
  header: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
    fontSize: 16,
  },
  image: {
    width: "100%", // Ensures the image fits within the width of the screen
    height: "100%", // Ensures the image fits within the height of the screen
    borderRadius: 10,
  },
});

export default Preview;
