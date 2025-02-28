import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { LeftArrow } from "../../assets/icons";
import { moderateScale } from "../../utils/Scaling";
import Orientation from "react-native-orientation-locker";
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

const SelectImageAngles = ({ navigation, route }) => {
  const batchId = route?.params?.batchId;
  const selectedTemplateId = route?.params?.selectedTemplateId;
  const [isExteriorSelected, setIsExteriorSelected] = useState(true);
  const [selectedAngles, setSelectedAngles] = useState([]);
  const [selectedInteriorAngles, setSelectedInteriorAngles] = useState([]);
  const [isLeftHandSelected, setIsLeftHandSelected] = useState(true);
  const [isRightHandSelected, setIsRightHandSelected] = useState(false);

  const handleLeftHandPress = () => {
    setIsLeftHandSelected(true);
    setIsRightHandSelected(false);
  };

  const handleRightHandPress = () => {
    setIsRightHandSelected(true);
    setIsLeftHandSelected(false);
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      Orientation.lockToPortrait();
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      Orientation.unlockAllOrientations();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const carAngles = [
    { id: 1, icon: frontCar },
    { id: 2, icon: rightAngleCar },
    { id: 3, icon: rightSideCar },
    { id: 4, icon: backRightAngleCar },
    { id: 5, icon: backCar },
    { id: 6, icon: backLeftAngleCar },
    { id: 7, icon: leftSideCar },
    { id: 8, icon: leftAngleCar },
  ];
  const interiorAngles = [
    { id: 1, icon: <CarWheel width={100} height={100} /> },
    { id: 2, icon: <CarAcConsole width={100} height={100} /> },
    { id: 3, icon: <CarTrunk width={100} height={100} /> },
    { id: 4, icon: <PassengerBackViewLeft width={100} height={100} /> },
    { id: 5, icon: <PassengerBackViewRight width={100} height={100} /> },
    {
      id: 6,
      icon: isLeftHandSelected ? (
        <MidConsoleView width={100} height={100} />
      ) : (
        <MidConsoleViewRight width={100} height={100} />
      ),
    },
    { id: 7, icon: <PassengerSideView width={100} height={100} /> },
    { id: 8, icon: <DriverSideView width={100} height={100} /> },
  ];
  const handleSelectAll = () => {
    if (selectedAngles.length === carAngles.length) {
      setSelectedAngles([]); // Deselect all
    } else {
      const allAngleIds = carAngles.map((angle) => angle.id);
      setSelectedAngles(allAngleIds); // Select all
    }
  };

  const handleSelectInteriorAll = () => {
    if (selectedInteriorAngles.length === interiorAngles.length) {
      setSelectedInteriorAngles([]); // Deselect all
    } else {
      const allAngleIds = interiorAngles.map((angle) => angle.id);
      setSelectedInteriorAngles(allAngleIds); // Select all
    }
  };

  // Function to handle toggling between exterior and interior images
  const handleToggle = (selected) => {
    setIsExteriorSelected(selected);
  };

  const renderCarItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        const newSelectedAngles = selectedAngles.includes(item.id)
          ? selectedAngles.filter((id) => id !== item.id)
          : [...selectedAngles, item.id];
        setSelectedAngles(newSelectedAngles);
      }}
      style={[
        styles.angleButton,
        selectedAngles.includes(item.id) && styles.selectedAngleButton,
      ]}
    >
      <Image
        style={{ width: 120, height: 120 }}
        resizeMode="contain"
        source={item.icon}
      />
    </TouchableOpacity>
  );

  const renderInteriorItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        const newSelectedAngles = selectedInteriorAngles.includes(item.id)
          ? selectedInteriorAngles.filter((id) => id !== item.id)
          : [...selectedInteriorAngles, item.id];
        setSelectedInteriorAngles(newSelectedAngles);
      }}
      style={[
        styles.angleButton,
        selectedInteriorAngles.includes(item.id) && styles.selectedAngleButton,
      ]}
    >
      <View
        style={{
          height: 150,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {item.icon}
      </View>
    </TouchableOpacity>
  );

  // useEffect(() => {
  //   (async () => {
  //     await Camera.requestCameraPermissionsAsync();
  //   })();
  // }, []);

  const requestCameraPermission = async () => {
    let permission;
    if (Platform.OS === "android") {
      permission = PERMISSIONS.ANDROID.CAMERA;
    } else {
      permission = PERMISSIONS.IOS.CAMERA;
    }

    try {
      const result = await request(permission);
      // setPermissionStatus(result);
      console.log("result", result);
      if (result === RESULTS.GRANTED) {
        setTimeout(() => {
          navigation.navigate("CameraScreen", {
            selectedAngles: selectedAngles,
            selectedInteriorAngles: selectedInteriorAngles,
            batchId: batchId,
            selectedTemplateId: selectedTemplateId,
            screenId: route?.params?.screenId,
            isLeftHandSelected: isLeftHandSelected,
          });
        }, 1000);
      } else if (result === RESULTS.DENIED) {
        Alert.alert("Permission Denied", "Camera access is denied.");
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          "Permission Blocked",
          "Camera access is blocked. Please enable it from settings."
        );
      }
    } catch (error) {
      console.error("Camera permission error:", error);
    }
  };

  const onClickNext = async () => {
    requestCameraPermission();
  };

  const isButtonDisabled =
    selectedAngles.length || selectedInteriorAngles.length;

  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <LeftArrow />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Select</Text>
        <Text style={styles.SelectImageAngles}>Image Angles</Text>

        <View style={styles.lineContainer}>
          <View style={styles.lineBlue} />
          <View style={styles.lineBlue} />
          <View style={styles.lineBlue} />
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isExteriorSelected && styles.toggleButtonActive,
            ]}
            onPress={() => handleToggle(true)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                isExteriorSelected && styles.toggleButtonTextActive,
              ]}
            >
              Exterior Images
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isExteriorSelected && styles.toggleButtonActive,
            ]}
            onPress={() => handleToggle(false)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                !isExteriorSelected && styles.toggleButtonTextActive,
              ]}
            >
              Interior Images
            </Text>
          </TouchableOpacity>
        </View>
        {!isExteriorSelected && (
          <View style={{ ...styles.headerContainer, marginBottom: 0 }}>
            <Text style={styles.promptText}>Select steering side</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#E0E0E0",
                elevation: 2,
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowColor: "#000",
                shadowOffset: { height: 2, width: 0 },
                borderRadius: 8,
              }}
            >
              <TouchableOpacity
                onPress={handleLeftHandPress}
                style={[
                  styles.selectAllButton,
                  { borderRadius: 8 },
                  isLeftHandSelected && styles.selectedButton,
                ]}
              >
                <Text
                  style={[
                    styles.selectAllText,
                    isLeftHandSelected && { color: "#FFFFFF" },
                  ]}
                >
                  Left hand
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRightHandPress}
                style={[
                  styles.selectAllButton,
                  { borderRadius: 8 },
                  isRightHandSelected && styles.selectedButton,
                ]}
              >
                <Text
                  style={[
                    styles.selectAllText,
                    isRightHandSelected && { color: "#FFFFFF" },
                  ]}
                >
                  Right hand
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.headerContainer}>
          <Text style={styles.promptText}>
            Tap on cards to select Car Angles
          </Text>
          <TouchableOpacity
            onPress={
              isExteriorSelected ? handleSelectAll : handleSelectInteriorAll
            }
            style={{ ...styles.selectAllButton, backgroundColor: "#2499DA" }}
          >
            <Text style={{ ...styles.selectAllText, color: "#FFF" }}>
              Select all
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={isExteriorSelected ? carAngles : interiorAngles}
          renderItem={isExteriorSelected ? renderCarItem : renderInteriorItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          extraData={
            isExteriorSelected ? selectedAngles : selectedInteriorAngles
          }
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.subContainer}>
          <TouchableOpacity
            disabled={!isButtonDisabled}
            onPress={onClickNext}
            style={{
              ...styles.nextButton,
              opacity: !isButtonDisabled ? 0.5 : 1,
            }}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
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
  SelectImageAngles: {
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
  nextButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  promptText: {
    fontSize: moderateScale(12),
    color: "#58595B",
  },
  selectAllButton: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  selectedButton: {
    backgroundColor: "#2499DA",
  },
  selectAllText: {
    color: "#898989", // White text for the button
    fontWeight: "600",
    textAlign: "center",
    fontSize: moderateScale(10),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#1095DE",
    borderRadius: 10,
  },
  toggleButtonText: {
    color: "#1095DE",
    fontWeight: "600",
    fontSize: moderateScale(12),
  },
  toggleButtonTextActive: {
    color: "#FFFFFF",
  },
  listContainer: {
    alignItems: "center",
    padding: 10,
  },
  angleButton: {
    // borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    width: "45%", // Set width to 45% to allow two items per row with some space between
    height: 150, // Adjust height as needed
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#fff",
  },
  angleInvisibleButton: {
    padding: 10,
    width: "45%",
    height: 150,
  },
  selectedAngleButton: {
    borderColor: "#00FF57",
    borderWidth: 2,
  },
});

export default SelectImageAngles;
