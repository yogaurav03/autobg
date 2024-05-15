import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import ImagePicker from "react-native-image-crop-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import {
  AcMedia,
  BackAngle,
  BootSpace,
  CameraIcon,
  CenterDashboard,
  DoorView,
  FrontAngle,
  LeftAngle,
  LeftSideAngle,
  Meter,
  RightAngle,
  RightSideAngle,
  SkipIcon,
  SpeedoMeter,
  Steering,
} from "../../assets/icons";
import MLCamera from "../../components/MLCamera";
import {
  AcMediaInterior,
  BackSide,
  BootSpaceInterior,
  CenterDashboardInterior,
  DoorViewInterior,
  FrontBack,
  Leveler,
  RearSide,
  SideAngle,
  SteeringMeter,
} from "../../components";
import { APIURLS } from "../../utils/ApiUrl";
import api from "../../utils/Api";
import { useAppState } from "../../context/AppStateContext";
import { moderateScale } from "../../utils/Scaling";

const { width, height } = Dimensions.get("window");

const Camera = ({ route, navigation }) => {
  const { state, dispatch } = useAppState();
  const selectedAngleIndex = route?.params?.selectedAngles;
  const selectedInteriorAngleIndex = route?.params?.selectedInteriorAngles;
  const batchId = route?.params?.batchId;
  const selectedTemplateId = route?.params?.selectedTemplateId;
  const [cameraCarAngles, setCameraCarAngles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAngleName, setSelectedAngleName] = useState("");
  const [isCentered, setIsCentered] = useState(false);

  const [carAngles, setCarAngles] = useState([
    {
      id: 1,
      icon: <FrontAngle width={30} />,
      name: "Front View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 2,
      icon: <BackAngle width={30} />,
      name: "Back View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 3,
      icon: <LeftSideAngle width={30} />,
      name: "Left View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 4,
      icon: <RightSideAngle width={30} />,
      name: "Right View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 5,
      icon: <LeftAngle width={30} />,
      name: "3/4th Rear View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 6,
      icon: <RightAngle width={30} />,
      name: "3/4th Front View",
      color: "",
      uri: "",
      path: "",
    },
  ]);

  const interiorAngles = [
    {
      id: 1,
      icon: <BootSpace width={30} />,
      name: "Boot Space",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 2,
      icon: <CenterDashboard width={30} />,
      name: "Center Dashboard",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 3,
      icon: <AcMedia width={30} />,
      name: "Ac Media",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 4,
      icon: <SpeedoMeter width={30} />,
      name: "Speedo Meter",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 5,
      icon: <DoorView width={30} />,
      name: "Door View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 6,
      icon: <Meter width={30} />,
      name: "Meter",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 7,
      icon: <Steering width={30} />,
      name: "Steering",
      color: "",
      uri: "",
      path: "",
    },
  ];

  const mergeCameraAngle = () => {
    let mergedSelections = [];

    selectedAngleIndex.forEach((index) => {
      const angle = carAngles.find((angle) => angle.id === index);
      if (angle) {
        mergedSelections.push({ ...angle, arrayType: "exterior" });
      }
    });

    selectedInteriorAngleIndex.forEach((index) => {
      const angle = interiorAngles.find((angle) => angle.id === index);
      if (angle) {
        mergedSelections.push({ ...angle, arrayType: "interior" });
      }
    });

    // Assign new sequential IDs
    const cameraAngles = mergedSelections.map((item, index) => ({
      ...item,
      newId: index + 1, // Assigning new sequential IDs starting from 1
    }));
    setCameraCarAngles(cameraAngles);
  };

  useEffect(() => {
    mergeCameraAngle();
  }, []);

  const cameraRef = useRef(null);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      ScreenOrientation.unlockAsync();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePicture();
        const rotatedImage = await ImageResizer.createResizedImage(
          photo.path,
          photo.width,
          photo.height,
          "JPEG",
          100,
          Platform.OS === "ios" ? 270 : 360,
          null,
          true,
          { mode: "contain", onlyScaleDown: false },
          { width: photo.height, height: photo.width }
        );
        console.log("photo", photo);
        console.log("rotatedImage", rotatedImage);

        uploadImage(rotatedImage);
      } catch (error) {
        console.error("Error taking picture:", error);
        setLoading(false);
      } finally {
      }
    } else {
      console.error("Camera ref is null");
    }
  };

  const cropImage = (uri) => {
    ImagePicker.openCropper({
      path: uri,
      width: width,
      height: 300,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        console.log("Cropped Image Path:", image);
        ``;
        // uploadImage(image); // You might want to upload or use the cropped image
      })
      .catch((error) => {
        console.error("Error cropping image:", error);
        setLoading(false);
      });
  };

  const uploadImage = async (item) => {
    setLoading(true);
    try {
      const data = await api.postFormData(
        APIURLS.uploadImage,
        {
          file: item?.uri,
          userid: state?.profileData?.userDetails?.id,
          batchid: batchId,
        },
        state.token
      );

      if (data.code === 1) {
        // Handle successful login here
        console.log("Upload Successful", data.status);
        updateAngleColor(
          selectedAngleName,
          "#8AEB0F",
          data?.uploadedUrl,
          item?.uri
        );
      } else {
        // Handle login failure here
        console.error("Upload Failed", data.status);
        setLoading(false);
        Alert.alert(data.status || "Please try again.");
      }
    } catch (error) {
      // Handle errors here
      console.error("Upload Error", error);
      setLoading(false);
    } finally {
    }
  };

  const updateAngleColor = (angleName, color, uri, path) => {
    setCameraCarAngles((prevAngles) =>
      prevAngles.map((angle) => {
        if (angle.name === angleName) {
          return { ...angle, color: color, uri: uri, path: path };
        }
        return angle;
      })
    );

    const currentIndex = cameraCarAngles.findIndex(
      (angle) => angle.name === selectedAngleName
    );
    const nextIndex = (currentIndex + 1) % cameraCarAngles.length;
    setSelectedAngleName(cameraCarAngles[nextIndex].name);
    setLoading(false);
  };

  const onClickSelectAngle = (item) => {
    setSelectedAngleName(item?.name);
  };

  const skipAndSelectNextAngle = () => {
    setCameraCarAngles((prevAngles) =>
      prevAngles.map((angle) => {
        if (angle.name === selectedAngleName) {
          return { ...angle, color: "#D9D9D9" };
        }
        return angle;
      })
    );

    const currentIndex = cameraCarAngles.findIndex(
      (angle) => angle.name === selectedAngleName
    );
    const nextIndex = (currentIndex + 1) % cameraCarAngles.length;
    setSelectedAngleName(cameraCarAngles[nextIndex].name);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onClickSelectAngle(item)}
        style={[
          styles.itemContainer,
          item.name === selectedAngleName ? styles.selectedAngle : {},
        ]}
      >
        {item?.icon}
        <Text
          style={[
            styles.text,
            item.name === selectedAngleName ? styles.selectedAngleTxt : {},
          ]}
        >
          {item.name?.split(" ")[0]}{" "}
          <Text style={styles.viewTxt}>{item.name?.split(" ")[1]}</Text>
        </Text>
        <View style={[styles.dot, { backgroundColor: item.color }]} />
      </TouchableOpacity>
    );
  };

  const goToCheckImages = () => {
    dispatch({ type: "CAR_ANGLES_DATA", payload: cameraCarAngles });
    navigation.navigate("CheckImagesScreen", {
      batchId: batchId,
      selectedTemplateId: selectedTemplateId,
      uploadedUrl: cameraCarAngles,
      screenId: route?.params?.screenId,
    });
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderStyle}>
          <ActivityIndicator size={"large"} color={"blue"} />
        </View>
      )}
      <View style={styles.container}>{/* <MLCamera ref={cameraRef} /> */}</View>
      <View style={styles.centerButtons}>
        <TouchableOpacity onPress={() => goToCheckImages()}>
          <View style={styles.galleryImg} />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!isCentered}
          onPress={takePicture}
          style={[styles.shutterButton, { opacity: !isCentered ? 0.5 : 1 }]}
        >
          <CameraIcon height={60} width={60} />
        </TouchableOpacity>

        <View style={{ height: "20%" }} />
      </View>
      <View style={styles.sideBar}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={cameraCarAngles}
          renderItem={renderItem}
          keyExtractor={(item) => item.newId.toString()}
        />
      </View>
      <TouchableOpacity
        onPress={skipAndSelectNextAngle}
        style={styles.specialButton}
      >
        <SkipIcon />
        <Text style={styles.specialButtonText}>Skip Image</Text>
      </TouchableOpacity>
      <Leveler setIsCentered={setIsCentered} />
      <View style={styles.stencilContainer}>
        {selectedAngleName === "Front View" ||
        selectedAngleName === "Back View" ? (
          <FrontBack fill={isCentered ? "#17FF2D" : "#D2042D"} />
        ) : selectedAngleName === "Left View" ||
          selectedAngleName === "Right View" ? (
          <SideAngle fill={isCentered ? "#17FF2D" : "#D2042D"} />
        ) : selectedAngleName === "3/4th Rear View" ? (
          <RearSide fill={isCentered ? "#17FF2D" : "#D2042D"} />
        ) : selectedAngleName === "3/4th Front View" ? (
          <BackSide fill={isCentered ? "#17FF2D" : "#D2042D"} />
        ) : selectedAngleName === "Speedo Meter" ? (
          <SteeringMeter />
        ) : selectedAngleName === "Boot Space" ? (
          <BootSpaceInterior />
        ) : selectedAngleName === "Center Dashboard" ? (
          <CenterDashboardInterior />
        ) : selectedAngleName === "Ac Media" ? (
          <AcMediaInterior />
        ) : selectedAngleName === "Door View" ? (
          <DoorViewInterior />
        ) : selectedAngleName === "Meter" ? (
          <Meter />
        ) : selectedAngleName === "Steering" ? (
          <Steering width={width} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
  },
  loaderStyle: {
    flex: 1,
    position: "absolute",
    top: "40%",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  sideBar: {
    paddingVertical: 30,
    justifyContent: "space-between",
    position: "absolute",
    left: Platform.OS === "android" ? 0 : 50,
    zIndex: 2,
    top: 0,
    bottom: 0,
  },
  itemContainer: {
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: 55,
  },
  selectedAngle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    backgroundColor: "#00BDFF",
  },
  selectedAngleTxt: {
    color: "#fff",
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  text: {
    fontSize: moderateScale(9),
    color: "#000",
    fontWeight: "bold",
  },
  viewTxt: {
    fontWeight: "500",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },
  centerButtons: {
    transform: [{ translateX: -50 }],
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    right: 0,
    zIndex: 2,
    top: 0,
    bottom: 0,
  },
  specialButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    transform: [{ rotate: "-90deg" }],
    borderWidth: 2,
    borderColor: "#FFF",
    position: "absolute",
    bottom: 20,
    zIndex: 2,
    right: 60,
  },
  specialButtonText: {
    color: "#FFF",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: moderateScale(10),
  },
  shutterButton: {},
  galleryImg: {
    height: 80,
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  stencilContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

export default Camera;
