import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { LeftArrow } from "../../assets/icons";

const WebViewScreen = ({ route }) => {
  const link = route?.params?.link;
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArewViewcontainer}>
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
        <WebView source={{ uri: link }} style={styles.webview} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArewViewcontainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#EAF7FF",
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
  },
});

export default WebViewScreen;
