import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker"; // Import the dropdown picker
import PhoneInput from "react-native-phone-number-input";
import { mainBg } from "../../assets/images";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { useAppState } from "../../context/AppStateContext";
import { moderateScale } from "../../utils/Scaling";

const SignUpScreen = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const { dispatch } = useAppState();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneInput = useRef(null);

  // State for the dropdown picker
  const [vertical, setVertical] = useState("Individual");
  const [open, setOpen] = useState(false); // Controls the dropdown visibility
  const [items, setItems] = useState([
    { label: "Individual", value: "Individual" },
    { label: "Marketplace", value: "Marketplace" },
    { label: "Dealership", value: "Dealership" },
  ]);

  const validateInput = () => {
    const checkValid = phoneInput.current?.isValidNumber(phoneNumber);

    if (!fullName.trim()) {
      Alert.alert("Please enter your full name.");
      return false;
    }

    if (!checkValid) {
      Alert.alert("Please enter a valid mobile number.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      const data = await api.post(APIURLS.signup, {
        username: fullName,
        email: email,
        password: password,
        vertical: vertical, // Sending the selected vertical
        whatsapp: phoneNumber,
        cc: countryCode,
      });
      console.log("SignUp Successful", data);

      if (data.code === 1) {
        Alert.alert(
          data.message,
          "Please follow steps on mail for account activation"
        );
        navigation.navigate("SignInScreen");
      } else {
        console.error("SignUp Failed", data.message);
        Alert.alert(data.message || "Sign-up failed. Please try again.");
      }
    } catch (error) {
      console.error("SignUp Error", error);
      Alert.alert("An error occurred during sign-up. Please try again.");
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
        <View style={{ flex: 0.3 }}>
          <Image style={{ width: width }} source={mainBg} />
        </View>
        <View style={styles.containerBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.welcomeText}>Sign Up!</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="grey"
              onChangeText={setFullName}
            />

            {/* <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="grey"
              onChangeText={setPhoneNumber}
              maxLength={10}
              keyboardType="number-pad"
            /> */}
            <PhoneInput
              ref={phoneInput}
              defaultValue={phoneNumber}
              layout="second"
              onChangeText={(text) => setPhoneNumber(text)}
              onChangeFormattedText={(text) => setFormattedValue(text)}
              // autoFocus
              onChangeCountry={(text) => setCountryCode(text?.callingCode?.[0])}
              containerStyle={{
                backgroundColor: "white",
                borderRadius: 8,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                marginBottom: 15,
              }}
              textContainerStyle={{ borderRadius: 8, backgroundColor: "white" }}
            />

            {/* Dropdown for Vertical Selection */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Vertical</Text>
              <DropDownPicker
                open={open}
                value={vertical}
                items={items}
                setOpen={setOpen}
                setValue={setVertical}
                setItems={setItems}
                style={styles.dropdownStyle}
                containerStyle={styles.dropdownContainerStyle}
                labelStyle={styles.dropdownLabelStyle}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="grey"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="grey"
              secureTextEntry={true}
              onChangeText={setPassword}
            />

            {/* <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              disabled={loading}
              onPress={handleSignUp}
              style={styles.signInButton}
            >
              <Text style={styles.signInButtonText}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.signInLinkText}>
              Already have an account?{" "}
              <Text
                style={styles.signInLink}
                onPress={() => navigation.navigate("SignInScreen")}
              >
                Sign in now
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
                <Text style={styles.termsText}>Terms and Conditions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TermsPolicyScreen", {
                    screenName: "Privacy",
                  })
                }
              >
                <Text style={styles.termsText}>Privacy Policy</Text>
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
    flex: 0.7,
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
  pickerContainer: {
    marginBottom: 15,
    zIndex: 1,
  },
  pickerLabel: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  dropdownStyle: {
    backgroundColor: "white",
    borderColor: "#ccc",
  },
  dropdownContainerStyle: {
    height: 58,
    borderRadius: 8,
  },
  dropdownLabelStyle: {
    fontSize: 16,
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
  signInLinkText: {
    textAlign: "center",
    fontSize: moderateScale(12),
    marginVertical: 10,
  },
  signInLink: {
    color: "#32A1FC",
  },
  termsView: {
    alignSelf: "center",
    marginBottom: 20,
  },
  termsText: {
    color: "#32A1FC",
    textAlign: "center",
    fontSize: moderateScale(12),
  },
});

export default SignUpScreen;
