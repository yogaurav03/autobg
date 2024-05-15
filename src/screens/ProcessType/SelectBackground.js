import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { LeftArrow, SelectedTick } from "../../assets/icons";
import { image4 } from "../../assets/images";
import { moderateScale } from "../../utils/Scaling";

const SelectBackground = ({ navigation }) => {
  const [selectedAngles, setSelectedAngles] = useState([]);
  const imageBg = [
    { id: 1, img: image4 },
    { id: 2, img: image4 },
    { id: 3, img: image4 },
    { id: 4, img: image4 },
    { id: 5, img: image4 },
    { id: 6, img: image4 },
  ];
  const handleSelectAll = () => {
    navigation.navigate("PreviewScreen", {
      imageData: imageBg,
      currentIndex: selectedAngles,
    });
    // if (selectedAngles.length === imageBg.length) {
    //   setSelectedAngles([]); // Deselect all
    // } else {
    //   const allAngleIds = imageBg.map(angle => angle.id);
    //   setSelectedAngles(allAngleIds); // Select all
    // }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        const newSelectedAngle = selectedAngles.includes(item.id)
          ? []
          : [item.id];
        setSelectedAngles(newSelectedAngle);
      }}
      style={[
        styles.angleButton,
        selectedAngles.includes(item.id) && styles.selectedAngleButton,
      ]}
    >
      {selectedAngles.includes(item.id) && (
        <View style={styles.tickContainer}>
          <SelectedTick />
        </View>
      )}
      <Image source={item.img} style={styles.imageStyle} />
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
        <Text style={styles.SelectBackground}>Select Background</Text>

        <View style={styles.lineContainer}>
          <View style={styles.lineBlue} />
          <View style={styles.lineBlue} />
          <View style={styles.lineGray} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.promptText}>
            Select Background image for preview
          </Text>
          <TouchableOpacity
            onPress={handleSelectAll}
            style={styles.selectAllButton}
          >
            <Text style={styles.selectAllText}>Preview</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={imageBg}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          extraData={selectedAngles}
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.subContainer}>
          <TouchableOpacity
            // onPress={() => navigation.navigate("SelectImageAnglesScreen")}
            onPress={() => Alert.alert("In Progress....")}
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
    paddingTop: Platform.OS === "android" ? 15 : 0,
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
  SelectBackground: {
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
  imageStyle: {
    height: 100,
    width: "95%",
    borderRadius: 10,
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
  listContainer: {
    alignItems: "center",
  },
  angleButton: {
    borderRadius: 10,
    width: "50%", // Set width to 45% to allow two items per row with some space between
    height: 100, // Adjust height as needed
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  selectedAngleButton: {
    borderColor: "#00FF57",
  },
  tickContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default SelectBackground;
