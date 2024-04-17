import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LeftArrow } from "../../assets/icons";
import { deleteIconAni } from "../../assets/lottie";
import LottieView from "lottie-react-native";
import { moderateScale } from "../../utils/Scaling";

const DeleteAccount = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconStyle}
      >
        <LeftArrow />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.subContainer}>
        <View style={styles.imgContainer}>
          <LottieView
            ref={(animation) => {
              animationRef = animation;
            }}
            source={deleteIconAni}
            autoPlay
            loop
            style={{ width: 200, height: 200, zIndex: 1, marginBottom: -70 }}
          />
          <Text style={styles.sadTxt}>Sad to see you go..</Text>
        </View>
        <Text style={styles.usernameHeadingTxt}>
          Write your username to confirm account delete process{" "}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#65656550"
        />
        <TouchableOpacity style={styles.btnContainer}>
          <Text style={styles.btnText}>DELETE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF7FF",
    padding: Platform.OS === "android" ? 10 : 20,
    justifyContent: "center",
  },
  iconStyle: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    top: 40,
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
    fontSize: moderateScale(12),
  },
  subContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  imgContainer: {
    backgroundColor: "#44A2FF",
    padding: 20,
    borderRadius: 10,
  },
  sadTxt: {
    fontWeight: "bold",
    fontSize: moderateScale(26),
    color: "#FFF",
    textAlign: "center",
  },
  usernameHeadingTxt: {
    fontWeight: "500",
    fontSize: moderateScale(12),
    color: "#747474",
    textAlign: "center",
    marginTop: 20,
  },
  input: {
    height: 58,
    backgroundColor: "#E7E7E7",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  btnContainer: {
    borderRadius: 10,
    backgroundColor: "#747474",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  btnText: {
    fontWeight: "bold",
    fontSize: moderateScale(18),
    color: "#FFF",
  },
});

export default DeleteAccount;
