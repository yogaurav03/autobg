import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { CarIcon, FrontView, LeftArrow } from "../../assets/icons";
import { moderateScale } from "../../utils/Scaling";
import { APIURLS } from "../../utils/ApiUrl";
import api from "../../utils/Api";
import { useAppState } from "../../context/AppStateContext";

const FolderName = ({ navigation, route }) => {
  const { state } = useAppState();

  const [numberPlate, setNumberPlate] = useState("");
  const userId = state?.profileData?.userDetails?.id;

  const createBatch = async () => {
    const response = await api.post(
      APIURLS.createBatch,
      {
        userid: userId,
        templateid: 0,
        numberplate: numberPlate,
      },
      state.token
    );
    if (response.code === 1) {
      navigation.navigate("SelectImageAnglesScreen", {
        batchId: response?.batchid,
        selectedTemplateId: 0,
        screenId: route.params?.id,
      });
    } else {
      Alert.alert(response.message || "Please try again.");
    }
  };

  const onPressFolder = () => {
    if (route.params?.id === 3) {
      createBatch();
    } else if (route.params?.id === 2) {
      navigation.navigate("SelectBackgroundScreen");
    } else {
      navigation.navigate("SelectTemplateScreen", {
        numberPlate: numberPlate,
        screenId: route.params?.id,
      });
    }
  };
  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <LeftArrow />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Enter</Text>
            <Text style={styles.folderName}>Folder Name</Text>

            <View style={styles.lineContainer}>
              <View style={styles.lineBlue} />
              <View style={styles.lineGray} />
              <View style={styles.lineGray} />
            </View>

            <View style={styles.subContainer}>
              <CarIcon width={200} height={200} />

              <TextInput
                placeholder="License plate number"
                onChangeText={setNumberPlate}
                style={styles.input}
              />

              <View style={styles.hintBox}>
                <Text style={styles.hintText}>Hint</Text>
                <Text style={styles.hintDescText}>
                  We save the folder by vehicle {"\n"} Registration number.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => onPressFolder()}
                disabled={numberPlate === "" ? true : false}
                style={[
                  styles.nextButton,
                  numberPlate === "" ? styles.disabledBtn : {},
                ]}
              >
                <Text style={styles.nextButtonText}>NEXT</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeareaviewContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: "#EAF7FF",
  },
  container: {
    flex: 1,
    padding: Platform.OS === "android" ? 10 : 10,
    backgroundColor: "#EAF7FF",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
  },
  header: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#9D9D9D",
    marginTop: 20,
  },
  folderName: {
    fontSize: moderateScale(24),
    color: "#2492FE",
    marginBottom: 10,
    fontWeight: "bold",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  lineBlue: {
    backgroundColor: "#2492FE",
    height: 5,
    width: "32%",
  },
  lineGray: {
    backgroundColor: "#E4E4E4",
    height: 5,
    width: "32%",
  },
  subContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  input: {
    width: "80%",
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  hintBox: {
    backgroundColor: "#D3EEFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  hintText: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#004E8E",
    fontSize: moderateScale(12),
  },
  hintDescText: {
    color: "#004E8E",
    fontSize: moderateScale(12),
    fontWeight: "300",
    textAlign: "center",
  },
  nextButton: {
    width: "80%",
    padding: 15,
    borderRadius: 25,
    backgroundColor: "#2499DA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
});

export default FolderName;
