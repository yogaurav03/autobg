import {
  View,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { icon } from "../../assets/lottie";
import { moderateScale } from "../../utils/Scaling";
import { carImg } from "../../assets/images";

const Splash = ({ navigation }) => {
  const { width, height } = Dimensions.get("screen");
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={{ flex: 0.4 }}>
          <LottieView
            ref={(animation) => {
              animationRef = animation;
            }}
            source={icon}
            autoPlay
            loop
            style={{ width: width, height: 300, zIndex: 1 }}
          />
        </View>
        <View style={{ flex: 0.5 }}>
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
