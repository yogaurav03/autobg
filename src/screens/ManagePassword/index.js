import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { mainBg } from "../../assets/images";
import { LeftArrow } from "../../assets/icons";
import { APIURLS } from "../../utils/ApiUrl";
import api from "../../utils/Api";
import { moderateScale } from "../../utils/Scaling";

const ManagePassword = ({ navigation, route }) => {
  const { width } = Dimensions.get("window");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const userid = route?.params?.userId;
      const response = await api.put(APIURLS.managepassword(userid), {
        oldpassword: oldPassword,
        newpassword: newPassword,
      });
      // Handle the successful password change here
      console.log("Password updated successfully", response);
      Alert.alert("Password has been updated.");
      // You may navigate back or to a confirmation screen
      navigation.goBack();
    } catch (error) {
      // Handle errors here
      console.error("Manage Password Error:", error);
      Alert.alert("Failed to update password. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
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
          <Text style={styles.welcomeText}>Manage Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Old Password"
            placeholderTextColor="grey"
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="grey"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="grey"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            onPress={handleSavePassword}
            disabled={loading}
            style={styles.signInButton}
          >
            <Text style={styles.signInButtonText}>
              {loading ? "Saving..." : "Save Password"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginTop: -30,
  },
  welcomeText: {
    fontSize: moderateScale(26),
    color: "black",
    marginBottom: 30,
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
  },
  didNotText: {
    color: "#929292",
    textAlign: "right",
  },
  ManagePasswordText: {
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
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
});

export default ManagePassword;
