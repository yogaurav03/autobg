import {
  View,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { icon1 } from "../../assets/lottie";
import { moderateScale } from "../../utils/Scaling";
import { carImg } from "../../assets/images";
import Video from "react-native-video";

const Splash = ({ navigation }) => {
  const { width, height } = Dimensions.get("screen");
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View
          style={{
            flex: 0.45,
            justifyContent: Platform.OS === "ios" ? "center" : "flex-end",
          }}
        >
          {Platform.OS === "ios" ? (
            <Video
              source={require("../../assets/logo.mp4")}
              style={{ width: width, height: 100, zIndex: 1 }}
              resizeMode="cover"
              repeat={true}
            />
          ) : (
            <LottieView
              source={icon1}
              autoPlay
              loop
              style={{ width: width, height: 300, zIndex: 1 }}
            />
          )}
        </View>
        <View style={{ flex: 0.45 }}>
          <Image
            source={carImg}
            resizeMode="contain"
            style={{ height: height / 2.5 }}
          />
        </View>
        <View style={styles.subContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignInScreen")}
            style={styles.btnContainer}
          >
            <Text style={styles.btnTxt}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  subContainer: {
    flex: 0.1,
    width: "80%",
  },
  btnContainer: {
    backgroundColor: "#32A1FC",
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
});

export default Splash;
