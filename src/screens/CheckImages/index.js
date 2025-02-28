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
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import Orientation from "react-native-orientation-locker";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { LeftArrow } from "../../assets/icons";
import { moderateScale, scale, verticalScale } from "../../utils/Scaling";
import { useAppState } from "../../context/AppStateContext";
import { useNavigation } from "@react-navigation/native";
import {
  backCar,
  backLeftAngleCar,
  backRightAngleCar,
  frontCar,
  leftAngleCar,
  leftSideCar,
  rightAngleCar,
  rightSideCar,
} from "../../assets/images";
import {
  CarAcConsole,
  CarTrunk,
  CarWheel,
  DriverSideView,
  MidConsoleView,
  MidConsoleViewRight,
  PassengerBackViewLeft,
  PassengerBackViewRight,
  PassengerSideView,
} from "../../assets/icons/interiorAngles";

const CheckImages = ({ route }) => {
  const [selectedView, setSelectedView] = useState("Exterior");
  const { state, dispatch } = useAppState();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const userId = state?.profileData?.userDetails?.id;
  const batchId = route?.params?.batchId;
  const selectedTemplateId = route?.params?.selectedTemplateId;
  const isLeftHandSelected = route?.params?.isLeftHandSelected;

  const [carAngles, setCarAngles] = useState([
    {
      id: 1,
      icon: frontCar,
      name: "Front View",
    },
    {
      id: 2,
      icon: rightAngleCar,
      name: "3/4th Front Right View",
    },
    {
      id: 3,
      icon: rightSideCar,
      name: "Right View",
    },
    {
      id: 4,
      icon: backRightAngleCar,
      name: "3/4th Rear Right View",
    },
    {
      id: 5,
      icon: backCar,
      name: "Back View",
    },
    {
      id: 6,
      icon: backLeftAngleCar,
      name: "3/4th Rear Left View",
    },
    {
      id: 7,
      icon: leftSideCar,
      name: "Left View",
    },
    {
      id: 8,
      icon: leftAngleCar,
      name: "3/4th Front Left View",
    },
  ]);

  const [interiorAngles, setInteriorAngles] = useState([
    {
      id: 1,
      icon: <CarWheel width={100} height={100} />,
      name: "Car Wheel",
    },
    {
      id: 2,
      icon: <CarTrunk width={100} height={100} />,
      name: "Car Trunk",
    },
    {
      id: 3,
      icon: isLeftHandSelected ? (
        <PassengerBackViewLeft width={100} height={100} />
      ) : (
        <PassengerBackViewRight width={100} height={100} />
      ),
      name: isLeftHandSelected
        ? "Passenger Back View Left"
        : "Passenger Back View Right",
    },
    {
      id: 4,
      icon: isLeftHandSelected ? (
        <PassengerBackViewRight width={100} height={100} />
      ) : (
        <PassengerBackViewLeft width={100} height={100} />
      ),
      name: isLeftHandSelected
        ? "Passenger Back View Right"
        : "Passenger Back View Left",
    },
    {
      id: 5,
      icon: isLeftHandSelected ? (
        <MidConsoleView width={100} height={100} />
      ) : (
        <MidConsoleViewRight width={100} height={100} />
      ),
      name: "Mid Console View",
    },
    {
      id: 6,
      icon: <CarAcConsole width={100} height={100} />,
      name: "Ac Console",
    },
    {
      id: 7,
      icon: <DriverSideView width={100} height={100} />,
      name: "Driver Side View",
    },
    {
      id: 8,
      icon: <PassengerSideView width={100} height={100} />,
      name: "Passenger Side View",
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
        Orientation.lockToPortrait();
      }, 100); // Delay for 100 milliseconds, adjust as necessary
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      Orientation.unlockAllOrientations();
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
                    <Image
                      style={{ width: 100, height: 100 }}
                      resizeMode="contain"
                      source={item.icon}
                    />
                    <Text style={styles.angleTxt}>{item?.name}</Text>
                  </View>
                  <View style={styles.subContainer}>
                    {item?.path === undefined || item?.path === "" ? (
                      <Text>No Data</Text>
                    ) : (
                      <Image
                        style={[styles.imgStyle]}
                        resizeMode="contain"
                        source={{
                          uri: item?.path,
                        }}
                      />
                    )}
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
                    {item?.path === undefined || item?.path === "" ? (
                      <Text> No Data</Text>
                    ) : (
                      <Image
                        style={[
                          styles.imgStyle,
                          Platform.OS === "ios" && {
                            transform: [{ rotate: "90deg" }],
                          },
                        ]}
                        resizeMode="contain"
                        source={{
                          uri: item?.path,
                        }}
                      />
                    )}
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
  },
});
