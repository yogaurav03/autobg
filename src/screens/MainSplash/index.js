// MainSplash.js
import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Video from "react-native-video";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const MainSplash = () => {
  const navigation = useNavigation();

  const handleVideoEnd = async () => {
    await AsyncStorage.setItem("isFirstInstall", "true");
    navigation.replace("SplashScreen");
  };

  return (
    <View style={styles.container}>
      <Video
        source={require("../../assets/splashVideo.mp4")}
        style={styles.backgroundVideo}
        resizeMode="cover"
        onEnd={handleVideoEnd}
        repeat={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    width: width,
    height: height,
  },
});

export default MainSplash;
