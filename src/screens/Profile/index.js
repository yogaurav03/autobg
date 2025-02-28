import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Linking,
  StatusBar,
} from "react-native";
import { profileImg } from "../../assets/images";
import { LeftArrow, LockIcon, RightArrow } from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppState } from "../../context/AppStateContext";
import { APIURLS } from "../../utils/ApiUrl";
import api from "../../utils/Api";
import { moderateScale } from "../../utils/Scaling";

const Profile = ({ route }) => {
  const navigation = useNavigation();
  const { state, dispatch } = useAppState();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (state.token) {
          const response = await api.get(APIURLS.getUser, state.token);
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Update context or global state to reflect logout
      dispatch({ type: "MAIN_CONTENT", payload: "HomeScreen" });
      dispatch({ type: "TOKEN", payload: "" });
      await AsyncStorage.setItem("isFirstInstall", "true");
    } catch (error) {
      console.error("Logout failed", error);
      // Handle any errors here
    }
  };

  const navigateWebView = (text) => {
    text === "Credit Balance"
      ? navigation.navigate("BillingScreen", { userData: userData })
      : text === "Manage Password"
      ? navigation.navigate("ManagePasswordScreen", {
          userId: userData?.userDetails?.id,
        })
      : navigation.navigate("PricingScreen");
    // navigation.navigate("WebViewScreen", {
    //     link: "https://autobg.ai/how_it_works.php",
    //   });
  };

  const renderListItem = (text) => (
    <TouchableOpacity
      onPress={() => navigateWebView(text)}
      style={styles.listItem}
    >
      <Text style={styles.listText}>{text}</Text>
      <RightArrow />
    </TouchableOpacity>
  );

  const renderHorizontalLine = () => <View style={styles.horizontalLine} />;
  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      <View style={styles.container}>
        {route?.params?.isBackPresent && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconStyle}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.shadowContainer}>
          <View style={styles.profilecontainer}>
            <Image source={profileImg} style={styles.profileImage} />
            <View>
              <Text
                style={styles.profileName}
                // numberOfLines={1}
                // ellipsizeMode="tail"
              >
                {userData?.userDetails?.userName}
              </Text>
              <Text style={styles.email}>{userData?.userDetails?.email}</Text>
            </View>
          </View>
          {/* <TouchableOpacity
            onPress={() =>
              navigation.navigate("ManagePasswordScreen", {
                userId: userData?.userDetails?.id,
              })
            }
            style={styles.mngPassword}
          >
            <LockIcon />
            <Text style={styles.mngText}>Manage password</Text>
          </TouchableOpacity> */}
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          {renderListItem("Manage Password")}
          {renderHorizontalLine()}
          {renderListItem("Credit Balance")}
          {renderHorizontalLine()}
          {renderListItem("Manage Plans")}
          {renderHorizontalLine()}
          {/* {renderListItem("How to use ?")} */}
          {renderHorizontalLine()}
        </View>

        {/* Logout and Delete Account buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("DeleteAccountScreen")}
            style={styles.delAccButton}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
        {/* <Text
          style={{ color: "#000", textAlign: "center", marginVertical: 20 }}
        >
          1.0.0(5)
        </Text> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeareaviewContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: "#EAF7FF",
    padding: Platform.OS === "android" ? 10 : 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#EAF7FF",
    padding: Platform.OS === "android" ? 10 : 20,
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
  },
  shadowContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  profilecontainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  mngPassword: {
    backgroundColor: "#2499DA",
    borderRadius: 30,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  mngText: {
    fontSize: moderateScale(10),
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  profileName: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2499DA", // Dark Grey color
    textTransform: "capitalize",
  },
  email: {
    color: "#9D9D9D80",
    fontSize: moderateScale(12),
  },
  listContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  listText: {
    fontSize: moderateScale(18),
    color: "#8A93A4", // Dark Grey color,
    fontWeight: "500",
    marginVertical: 10,
  },
  arrow: {
    fontSize: moderateScale(18),
    color: "#3498db", // Blue color
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#bdc3c7", // Light Grey color
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  delAccButton: {
    backgroundColor: "#DA4524",
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
    width: "48%",
  },
  logoutButton: {
    backgroundColor: "#CFCFCF",
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
    width: "48%",
  },
  buttonText: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});

export default Profile;
