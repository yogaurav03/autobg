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
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { useAppState } from "../../context/AppStateContext";
import { moderateScale } from "../../utils/Scaling";

const SignInScreen = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const { dispatch } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const data = await api.post(APIURLS.login, {
        email: email,
        password: password,
      });

      if (data.code === 1) {
        // Handle successful login here
        console.log("Login Successful", data.message);
        dispatch({ type: "TOKEN", payload: data.token });
      } else {
        // Handle login failure here
        console.error("Login Failed", data.message);
        Alert.alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      // Handle errors here
      console.error("Login Error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.4 }}>
        <Image style={{ width: width }} source={mainBg} />
      </View>
      <View style={styles.containerBox}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="grey"
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="grey"
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading}
          onPress={() => handleSignIn()}
          style={styles.signInButton}
        >
          <Text style={styles.signInButtonText}>
            {loading ? "Signing In..." : "Sign In"}
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
    color: "#33A3FF",
    marginBottom: 20,
    fontWeight: "bold",
  },
  continueText: {
    color: "#929292",
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
  },
  forgotPasswordText: {
    color: "#32A1FC",
    textAlign: "right",
    marginBottom: 20,
    fontSize: moderateScale(12),
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
    fontSize: moderateScale(12),
  },
  termsView: {
    alignSelf: "center",
  },
});

export default SignInScreen;
