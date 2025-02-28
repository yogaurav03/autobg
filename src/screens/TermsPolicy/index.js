import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Text,
  ScrollView,
  StatusBar,
} from "react-native";
import { LeftArrow } from "../../assets/icons";
import Terms from "../../components/Terms";
import Privacy from "../../components/Privacy";
import { moderateScale } from "../../utils/Scaling";

const ForgotPassword = ({ navigation, route }) => {
  const screenName = route?.params?.screenName;
  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconStyle}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.titleText}>
            {screenName === "Terms" ? "Terms & Condition" : "Privacy Policy"}
          </Text>
          {screenName === "Terms" ? <Terms /> : <Privacy />}
        </ScrollView>
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
    padding: Platform.OS === "android" ? 10 : 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
  },
  titleText: {
    color: "#2492FE",
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginVertical: 20,
  },
});

export default ForgotPassword;
