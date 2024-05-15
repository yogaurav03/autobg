import {
  View,
  Text,
  Platform,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { LeftArrow } from "../../assets/icons";
import { moderateScale, scale, verticalScale } from "../../utils/Scaling";
import {
  AcMedia,
  BackAngle,
  BootSpace,
  CenterDashboard,
  DoorView,
  FrontAngle,
  LeftAngle,
  LeftSideAngle,
  Meter,
  RightAngle,
  RightSideAngle,
  SpeedoMeter,
  Steering,
} from "../../assets/icons";
import { useAppState } from "../../context/AppStateContext";
import { useNavigation } from "@react-navigation/native";

const CheckImages = ({ route }) => {
  const [selectedView, setSelectedView] = useState("Exterior");
  const { state, dispatch } = useAppState();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const userId = state?.profileData?.userDetails?.id;
  const batchId = route?.params?.batchId;
  const selectedTemplateId = route?.params?.selectedTemplateId;

  const [carAngles, setCarAngles] = useState([
    {
      id: 1,
      icon: <FrontAngle width={80} height={80} />,
      name: "Front View",
    },
    {
      id: 2,
      icon: <BackAngle width={80} height={80} />,
      name: "Back View",
    },
    {
      id: 3,
      icon: <LeftSideAngle width={80} height={80} />,
      name: "Left View",
    },
    {
      id: 4,
      icon: <RightSideAngle width={80} height={80} />,
      name: "Right View",
    },
    {
      id: 5,
      icon: <LeftAngle width={80} height={80} />,
      name: "3/4th Rear View",
    },
    {
      id: 6,
      icon: <RightAngle width={80} height={80} />,
      name: "3/4th Front View",
    },
  ]);

  const [interiorAngles, setInteriorAngles] = useState([
    {
      id: 1,
      icon: <BootSpace width={80} height={80} />,
      name: "Boot Space",
    },
    {
      id: 2,
      icon: <CenterDashboard width={80} height={80} />,
      name: "Center Dashboard",
    },
    {
      id: 3,
      icon: <AcMedia width={80} height={80} />,
      name: "Ac Media",
    },
    {
      id: 4,
      icon: <SpeedoMeter width={80} height={80} />,
      name: "Speedo Meter",
    },
    {
      id: 5,
      icon: <DoorView width={80} height={80} />,
      name: "Door View",
    },
    {
      id: 6,
      icon: <Meter width={80} height={80} />,
      name: "Meter",
    },
    {
      id: 7,
      icon: <Steering width={80} height={80} />,
      name: "Steering",
    },
  ]);

  const mergeDataWithStates = (dataArray, carAngles, interiorAngles) => {
    const newCarAngles = carAngles.map((angle) => {
      const foundItem = dataArray.find(
        (item) => item.arrayType === "exterior" && item.id === angle.id
      );
      return foundItem
        ? { ...angle, uri: foundItem.uri, path: foundItem.path }
        : angle;
    });

    const newInteriorAngles = interiorAngles.map((angle) => {
      const foundItem = dataArray.find(
        (item) => item.arrayType === "interior" && item.id === angle.id
      );
      return foundItem
        ? { ...angle, uri: foundItem.uri, path: foundItem.path }
        : angle;
    });

    return { newCarAngles, newInteriorAngles };
  };

  useEffect(() => {
    const { newCarAngles, newInteriorAngles } = mergeDataWithStates(
      state?.carAnglesData,
      carAngles,
      interiorAngles
    );
    setCarAngles(newCarAngles);
    setInteriorAngles(newInteriorAngles);
  }, []);

  const urls = state?.carAnglesData
    ?.filter((item) => item.uri)
    .map((item) => item.uri);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      // Optionally introduce a delay if needed
      setTimeout(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }, 100); // Delay for 100 milliseconds, adjust as necessary
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      ScreenOrientation.unlockAsync();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const processImages = async () => {
    setLoading(true);
    try {
      const data = await api.post(
        route?.params?.screenId === 1
          ? APIURLS.withtemplate
          : APIURLS.withouttemplate,
        {
          urls: urls,
          userid: userId,
          templateid: selectedTemplateId,
          collectionid: batchId,
        }
      );

      if (data.code === 1) {
        console.log("Process Images Successful", data.status);
        navigation.navigate("TaskQueuedScreen");
      } else {
        console.error("Process Images Failed", data.status);
        Alert.alert(data.status || "Process Images failed. Please try again.");
      }
    } catch (error) {
      // Handle errors here
      console.error("Process Images Error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerName}>Check Images</Text>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedView === "Exterior" && styles.segmentButtonActive,
            ]}
            onPress={() => setSelectedView("Exterior")}
          >
            <Text
              style={[
                styles.segmentText,
                selectedView === "Exterior" && styles.segmentTextActive,
              ]}
            >
              Exterior
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedView === "Interior" && styles.segmentButtonActive,
            ]}
            onPress={() => setSelectedView("Interior")}
          >
            <Text
              style={[
                styles.segmentText,
                selectedView === "Interior" && styles.segmentTextActive,
              ]}
            >
              Interior
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ marginBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {selectedView === "Exterior"
            ? carAngles.map((item) => (
                <View key={item.id} style={styles.listContainer}>
                  <View style={styles.subContainer}>
                    {item?.icon}
                    <Text style={styles.angleTxt}>{item?.name}</Text>
                  </View>
                  <View style={styles.subContainer}>
                    <Image
                      style={styles.imgStyle}
                      source={{ uri: item?.path }}
                    />
                  </View>
                </View>
              ))
            : interiorAngles.map((item) => (
                <View key={item.id} style={styles.listContainer}>
                  <View style={styles.subContainer}>
                    {item?.icon}
                    <Text style={styles.angleTxt}>{item.name}</Text>
                  </View>
                  <View style={styles.subContainer}>
                    <Image
                      style={styles.imgStyle}
                      source={{
                        uri:
                          item?.path === undefined
                            ? "https://via.placeholder.com/300x300.png?text=No+Data"
                            : item?.path,
                      }}
                    />
                  </View>
                </View>
              ))}
        </ScrollView>
        <TouchableOpacity
          onPress={() => processImages()}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckImages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "android" ? 10 : 20,
    backgroundColor: "#EAF7FF", // Background color of the screen
    paddingTop: Platform.OS === "android" ? 15 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
  },
  headerName: {
    fontSize: moderateScale(24),
    color: "#2492FE",
    marginBottom: 10,
    fontWeight: "bold",
  },
  submitButton: {
    width: "80%",
    padding: 15,
    borderRadius: 25,
    backgroundColor: "#2499DA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  segmentedControl: {
    flexDirection: "row",
    margin: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 26,
  },
  segmentButtonActive: {
    backgroundColor: "#33A3FF",
  },
  segmentText: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#004E8E",
  },
  angleTxt: {
    fontSize: moderateScale(10),
    color: "#58595B",
    marginTop: -5,
  },
  segmentTextActive: {
    color: "#ffffff",
  },
  listContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(100),
    width: "100%",
    marginVertical: 5,
  },
  subContainer: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  imgStyle: {
    height: verticalScale(100),
    width: scale(150),
    resizeMode: "contain",
  },
});
