import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  FlatList,
} from "react-native";
import {
  AcMedia,
  BackAngle,
  BootSpace,
  CenterDashboard,
  DoorView,
  FrontAngle,
  LeftAngle,
  LeftArrow,
  LeftSideAngle,
  Meter,
  RightAngle,
  RightSideAngle,
  SpeedoMeter,
  Steering,
} from "../../assets/icons";
import { moderateScale } from "../../utils/Scaling";

const SelectImageAngles = ({ navigation, route }) => {
  const batchId = route?.params?.batchId;
  const [isExteriorSelected, setIsExteriorSelected] = useState(true);
  const [selectedAngles, setSelectedAngles] = useState([]);
  const [selectedInteriorAngles, setSelectedInteriorAngles] = useState([]);

  const carAngles = [
    { id: 1, icon: <FrontAngle /> },
    { id: 2, icon: <BackAngle /> },
    { id: 3, icon: <LeftAngle /> },
    { id: 4, icon: <RightAngle /> },
    { id: 5, icon: <LeftSideAngle /> },
    { id: 6, icon: <RightSideAngle /> },
  ];
  const interiorAngles = [
    { id: 1, icon: <BootSpace width={100} /> },
    { id: 2, icon: <CenterDashboard width={100} /> },
    { id: 3, icon: <AcMedia width={100} /> },
    { id: 4, icon: <SpeedoMeter width={100} /> },
    { id: 5, icon: <DoorView width={100} /> },
    { id: 6, icon: <Meter width={100} /> },
    { id: 7, icon: <Steering width={100} /> },
    { id: 8, icon: "" },
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
      {item.icon}
    </TouchableOpacity>
  );

  const renderInteriorItem = ({ item }) =>
    item.id === 8 ? (
      <View style={[styles.angleInvisibleButton]}>{item.icon}</View>
    ) : (
      <TouchableOpacity
        onPress={() => {
          const newSelectedAngles = selectedInteriorAngles.includes(item.id)
            ? selectedInteriorAngles.filter((id) => id !== item.id)
            : [...selectedInteriorAngles, item.id];
          setSelectedInteriorAngles(newSelectedAngles);
        }}
        style={[
          styles.angleButton,
          selectedInteriorAngles.includes(item.id) &&
            styles.selectedAngleButton,
        ]}
      >
        {item.icon}
      </TouchableOpacity>
    );

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.headerContainer}>
          <Text style={styles.promptText}>
            Tap on cards to select Car Angles
          </Text>
          <TouchableOpacity
            onPress={
              isExteriorSelected ? handleSelectAll : handleSelectInteriorAll
            }
            style={styles.selectAllButton}
          >
            <Text style={styles.selectAllText}>Select all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={isExteriorSelected ? carAngles : interiorAngles}
          renderItem={isExteriorSelected ? renderCarItem : renderInteriorItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          extraData={
            isExteriorSelected ? selectedAngles : selectedInteriorAngles
          }
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.subContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CameraScreen", {
                selectedAngles: selectedAngles,
                selectedInteriorAngles: selectedInteriorAngles,
                batchId: batchId,
              })
            }
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#2499DA",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
  },
  selectAllText: {
    color: "#FFFFFF", // White text for the button
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
    borderWidth: 1,
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
    elevation: 3,
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
