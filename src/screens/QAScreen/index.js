import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  BottomArrow,
  CrossIcon,
  LeftArrow,
  ReportedIcon,
  RightArrow,
  TickIcon,
} from "../../assets/icons";
import { moderateScale } from "../../utils/Scaling";

const QAScreen = ({ navigation, route }) => {
  const imageData = route.params?.imageData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const { height, width } = Dimensions.get("window");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [checklistItems, setChecklistItems] = useState([
    { label: "Bad clipping", checked: false },
    { label: "Alignment - Rotation", checked: false },
    { label: "Road Position", checked: false },
    { label: "Guidelines Ignored", checked: false },
    { label: "Number Plate", checked: false },

    // Add more checklist items as needed
  ]);

  useEffect(() => {
    const lockOrientation = async () => {
      // Lock the orientation to landscape
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    lockOrientation();

    // Clean up the orientation lock on component unmount
    return () => {
      const unlockOrientation = async () => {
        await ScreenOrientation.unlockAsync(); // This will unlock the orientation
      };

      unlockOrientation();
    };
  }, []);

  const handleFail = () => {
    setIsModalVisible(true);
  };

  const handlePass = () => {
    // Handle logic when the "Pass" button is pressed
    console.log("Pass");
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : imageData.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < imageData.length - 1 ? prevIndex + 1 : 0
    );
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleChecklistToggle = (index) => {
    setChecklistItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const onSubmit = () => {
    closeModal();
    setIsReported(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.arrowButton}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconStyle}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handlePrev}>
          <LeftArrow height={100} width={60} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleFail()}
          style={styles.failContainer}
        >
          <Text style={styles.buttonText}>Fail</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: imageData[currentIndex].data.doneImgUrl }}
        resizeMode="contain"
        style={{ ...styles.image, height: height, width: "68%" }}
      />

      <View style={styles.arrowButton}>
        <View style={styles.buttonContainer}>
          <View style={styles.beforeContainer}>
            <Text style={styles.beforeTxt}>Before</Text>
          </View>
          <View style={styles.afterContainer}>
            <Text style={styles.afterTxt}>After</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleNext}>
          <RightArrow height={100} width={60} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("QADoneScreen")}
          style={styles.passContainer}
        >
          <Text style={styles.buttonText}>Pass</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.titleContainer}>
              <TouchableOpacity onPress={closeModal}>
                <CrossIcon height={18} width={18} />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                Select what's wrong in image{" "}
              </Text>
              <BottomArrow height={18} width={18} />
            </View>

            <ScrollView style={styles.checklistContainer}>
              {checklistItems.map((item, index) => (
                <View key={item.label} style={styles.listContainer}>
                  <Text style={styles.labelTxt}>{item.label}</Text>
                  <TouchableOpacity
                    onPress={() => handleChecklistToggle(index)}
                    style={styles.checkboxContainer}
                  >
                    {item?.checked && <TickIcon width={15} />}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <Pressable style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitButtonText}>Submit Issue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isReported}
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={() => setIsReported(false)}
      >
        <View style={styles.modalContainer}>
          <ReportedIcon />
          <TouchableOpacity
            onPress={() => setIsReported(false)}
            style={styles.reportedCon}
          >
            <Text style={styles.reportedTxt}>REPORTED</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#222222",
    width: "100%",
  },
  reportedCon: {
    backgroundColor: "#A50000",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  reportedTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(22),
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    margin: 1,
  },
  labelTxt: {
    color: "#909090",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  checkboxContainer: {
    borderWidth: 0.5,
    borderRadius: 4,
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  beforeTxt: {
    color: "#87B2CA",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  afterTxt: {
    color: "#fff",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  beforeContainer: {
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    padding: 10,
    paddingHorizontal: 20,
  },
  afterContainer: {
    borderRadius: 40,
    backgroundColor: "#2499DA",
    padding: 15,
    paddingHorizontal: 20,
    marginLeft: -20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowButton: {
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
    paddingVertical: 20,
    width: "15%",
  },
  arrowText: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    resizeMode: "cover",
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#FFF",
  },
  failContainer: {
    borderColor: "#960000",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: "#D9D9D920",
  },
  passContainer: {
    borderColor: "#8AEB0F",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: "#D9D9D920",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#222222",
    borderRadius: 10,
    padding: 20,
    width: "60%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#7D7D7D",
  },
  checklistContainer: {
    maxHeight: 200,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "#004E8E",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 15,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(12),
  },
  closeButton: {
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: moderateScale(16),
    color: "red",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default QAScreen;
