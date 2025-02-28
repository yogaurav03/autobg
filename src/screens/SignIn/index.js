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
  Linking,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <View style={styles.container}>
        <View style={{ flex: 0.4 }}>
          <Image style={{ width: width }} source={mainBg} />
        </View>
        <View style={styles.containerBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="grey"
              onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter Password"
                placeholderTextColor="grey"
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <View style={styles.togglePasswordText}>
                  {isPasswordVisible ? (
                    <Icon name="eye" size={moderateScale(24)} color="#ACACAC" />
                  ) : (
                    <Icon
                      name="eye-with-line"
                      size={moderateScale(24)}
                      color="#ACACAC"
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

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

            <Text
              style={{
                textAlign: "center",
                fontSize: moderateScale(12),
                marginBottom: 20,
              }}
            >
              Don't have an account ?{" "}
              <Text
                onPress={() => navigation.navigate("SignUpScreen")}
                style={{ color: "#32A1FC" }}
              >
                Sign up now
              </Text>
            </Text>

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
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBox: {
    flex: 0.6,
    paddingHorizontal: 40,
    paddingTop: 40,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  passwordInput: {
    flex: 1,
    height: 58,
    paddingHorizontal: 10,
  },
  togglePasswordText: {
    paddingHorizontal: 15,
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
    marginTop: 30,
    marginBottom: 10,
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
    marginBottom: 20,
  },
});

export default SignInScreen;
