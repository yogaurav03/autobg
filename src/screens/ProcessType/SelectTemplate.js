import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  Linking,
} from "react-native";
import { LeftArrow, NoTemplate } from "../../assets/icons";
import { useAppState } from "../../context/AppStateContext";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { moderateScale } from "../../utils/Scaling";

const TemplateCard = ({ id, name, onPress, isSelected, image }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      style={[styles.templateCard, isSelected && styles.selectedTemplate]}
    >
      <Image source={{ uri: image }} style={styles.templateImage} />
      <View style={styles.templateTextContainer}>
        <Text style={styles.name}>Template Name</Text>
        <Text style={styles.templateName}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SelectTemplate = ({ navigation, route }) => {
  const { state } = useAppState();
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateData, setTemplateData] = useState([]);

  const numberPlate = route.params?.numberPlate;

  const userId = state.profileData?.userDetails?.id;

  const fetchTemplateData = async () => {
    try {
      if (state.token) {
        const response = await api.get(APIURLS.selecttemplate, state.token);
        setTemplateData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchTemplateData();
  }, []);

  const handleTemplatePress = (id) => {
    setSelectedTemplateId(id);
  };

  const createBatch = async () => {
    const response = await api.post(
      APIURLS.createBatch,
      {
        userid: userId,
        templateid: selectedTemplateId,
        numberplate: numberPlate,
      },
      state.token
    );
    if (response.code === 1) {
      navigation.navigate("SelectImageAnglesScreen", {
        batchId: response?.batchid,
        selectedTemplateId: selectedTemplateId,
        screenId: route?.params?.screenId,
      });
    } else {
      Alert.alert(response.message || "Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      {templateData.length === 0 ? (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#D3EEFF",
              marginTop: 10,
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderRadius: 100,
                borderWidth: 15,
                borderColor: "#2499DA4D",
              }}
            >
              <NoTemplate />
            </View>
            <View
              style={{
                backgroundColor: "#9FD5F4",
                paddingVertical: 17,
                paddingHorizontal: 26,
                borderRadius: 8,
                marginHorizontal: 10,
                marginVertical: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#004E8E",
                  fontSize: moderateScale(10),
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                No templates found. Please visit our website and create template
                to proceed.
              </Text>
              <Text
                style={{
                  color: "#004E8E",
                  fontSize: moderateScale(10),
                  fontWeight: "700",
                  textAlign: "center",
                  marginVertical: 10,
                }}
                onPress={() => Linking.openURL("https://autobg.ai/")}
              >
                www.Autobg.ai
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("MainScreen")}
            style={[styles.nextButton, { alignSelf: "center" }]}
          >
            <Text style={styles.nextButtonText}>Back to dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.header}>Select</Text>
          <Text style={styles.SelectTemplate}>Template</Text>

          <View style={styles.lineContainer}>
            <View style={styles.lineBlue} />

            <View style={styles.lineBlue} />
            <View style={styles.lineGray} />
          </View>

          {/* Scrollable list of template cards */}
          <ScrollView style={styles.templateList}>
            {templateData?.map((template) => (
              <TemplateCard
                key={template.templateId}
                id={template.templateId}
                name={template.templateName}
                onPress={handleTemplatePress}
                isSelected={template.templateId === selectedTemplateId}
                image={template.backdropImg}
              />
            ))}
          </ScrollView>

          <View style={styles.subContainer}>
            <TouchableOpacity
              disabled={selectedTemplateId === null ? true : false}
              onPress={() => createBatch()}
              style={[
                styles.nextButton,
                selectedTemplateId === null ? styles.disabledBtn : {},
              ]}
            >
              <Text style={styles.nextButtonText}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  SelectTemplate: {
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
    marginBottom: 20,
  },
  lineBlue: {
    backgroundColor: "#2492FE",
    height: 5,
    width: "32%",
  },
  selectedTemplate: {
    borderColor: "#2499DA",
    borderWidth: 2,
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
  templateList: {
    flex: 1,
  },
  templateCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    width: "100%",
    height: 110,
  },
  templateImage: {
    width: 133,
    height: 96,
    marginRight: 10,
    borderRadius: 10,
  },
  templateTextContainer: {
    flex: 1,
  },
  templateName: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#686868",
  },
  name: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#32A1FC",
  },
});

export default SelectTemplate;
