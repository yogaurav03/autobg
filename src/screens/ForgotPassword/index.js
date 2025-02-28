import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { mainBg } from "../../assets/images";
import { LeftArrow } from "../../assets/icons";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { moderateScale } from "../../utils/Scaling";

const ForgotPassword = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const response = await api.put(APIURLS.forgotpassword, {
        email: email,
      });
      // Handle the response from the forgot password API
      console.log("Reset email sent:", response);
      Alert.alert(response?.message);
    } catch (error) {
      // Handle any errors here
      console.error("Forgot Password Error:", error);
      Alert.alert("An error occurred while trying to reset your password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.4 }}>
        <Image style={{ width: width }} source={mainBg} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconStyle}
        >
          <LeftArrow />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerBox}>
        <Text style={styles.welcomeText}>Forgot Password ?</Text>
        <Text style={styles.signInText}>Enter registered Email to reset</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="grey"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.didNotText}>
            Did not receive{" "}
            <Text style={styles.forgotPasswordText}>Resend</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.signInButton}
          disabled={loading}
        >
          <Text style={styles.signInButtonText}>
            {loading ? "Sending..." : "Send"}
          </Text>
        </TouchableOpacity>
        <View style={styles.termsView}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TermsPolicyScreen", {
                screenName: "Terms",
              })
            }
          >
            <Text style={styles.termsText}>Terms and condition </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TermsPolicyScreen", {
                screenName: "Privacy",
              })
            }
          >
            <Text style={styles.termsText}>Privacy policy </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconStyle: {
    position: "absolute",
    top: 40,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  containerBox: {
    flex: 0.6,
    padding: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#EFF9FF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  welcomeText: {
    fontSize: moderateScale(26),
    color: "black",
    marginBottom: 10,
    fontWeight: "bold",
  },
  signInText: {
    fontSize: moderateScale(14),
    color: "#929292",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    height: 58,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 15,
    paddingHorizontal: 10,
    marginTop: 30,
  },
  didNotText: {
    color: "#929292",
    textAlign: "right",
  },
  forgotPasswordText: {
    color: "#32A1FC",
    marginBottom: 20,
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
  },
  signInButton: {
    backgroundColor: "#32A1FC",
    borderRadius: 30,
    paddingVertical: 20,
    alignItems: "center",
    marginVertical: 30,
  },
  signInButtonText: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  termsText: {
    color: "#32A1FC",
    textAlign: "center",
  },
  termsView: {
    alignSelf: "center",
    marginTop: 50,
  },
});

export default ForgotPassword;
