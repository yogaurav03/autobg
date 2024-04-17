import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
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
import { BackSide, FrontBack, RearSide, SideAngle } from "../../components";
import { APIURLS } from "../../utils/ApiUrl";
import api from "../../utils/Api";
import { useAppState } from "../../context/AppStateContext";
import { moderateScale } from "../../utils/Scaling";

const Camera = ({ route }) => {
  const { state, dispatch } = useAppState();
  const selectedAngleIndex = route?.params?.selectedAngles;
  const selectedInteriorAngleIndex = route?.params?.selectedInteriorAngles;
  const batchId = route?.params?.batchId;
  const [cameraCarAngles, setCameraCarAngles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [align, setAlign] = useState(false);
  const [selectedAngleName, setSelectedAngleName] = useState("");
  const carAngles = [
    { id: 1, icon: <FrontAngle width={30} />, name: "Front View", color: "" },
    { id: 2, icon: <BackAngle width={30} />, name: "Back View", color: "" },
    { id: 3, icon: <LeftAngle width={30} />, name: "Left View", color: "" },
    { id: 4, icon: <RightAngle width={30} />, name: "Right View", color: "" },
    {
      id: 5,
      icon: <LeftSideAngle width={30} />,
      name: "3/4th Rear View",
      color: "",
    },
    {
      id: 6,
      icon: <RightSideAngle width={30} />,
      name: "3/4th Front View",
      color: "",
    },
  ];
  const interiorAngles = [
    { id: 1, icon: <BootSpace width={30} />, name: "Boot Space", color: "" },
    {
      id: 2,
      icon: <CenterDashboard width={30} />,
      name: "Center Dashboard",
      color: "",
    },
    { id: 3, icon: <AcMedia width={30} />, name: "Ac Media", color: "" },
    {
      id: 4,
      icon: <SpeedoMeter width={30} />,
      name: "Speedo Meter",
      color: "",
    },
    { id: 5, icon: <DoorView width={30} />, name: "Door View", color: "" },
    { id: 6, icon: <Meter width={30} />, name: "Meter", color: "" },
    { id: 7, icon: <Steering width={30} />, name: "Steering", color: "" },
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

  let cameraRef;

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

  const takePicture = async () => {
    if (cameraRef) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.takePictureAsync(options);
      console.log("data", data);
      uploadImage(data);
    }
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
        // dispatch({ type: "TOKEN", payload: data.token });
      } else {
        // Handle login failure here
        console.error("Upload Failed", data.status);
        Alert.alert(data.status || "Please try again.");
      }
    } catch (error) {
      // Handle errors here
      console.error("Upload Error", error);
    } finally {
      setLoading(false);
    }
  };

  const onClickSelectAngle = (item) => {
    setSelectedAngleName(item?.name);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onClickSelectAngle(item)}
        style={styles.itemContainer}
      >
        {item?.icon}
        <Text style={styles.text}>
          {item.name?.split(" ")[0]}{" "}
          <Text style={styles.viewTxt}>{item.name?.split(" ")[1]}</Text>
        </Text>
        <View style={[styles.dot, { backgroundColor: item.color }]} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <MLCamera />

        <View style={styles.centerButtons}>
          <View style={styles.galleryImg} />

          <TouchableOpacity onPress={takePicture} style={styles.shutterButton}>
            <CameraIcon height={60} width={60} />
          </TouchableOpacity>

          <View style={{ height: "20%" }} />
        </View>
      </View>
      <View style={styles.sideBar}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={cameraCarAngles}
          renderItem={renderItem}
          keyExtractor={(item) => item.newId.toString()}
        />
      </View>
      <TouchableOpacity style={styles.specialButton}>
        <SkipIcon />
        <Text style={styles.specialButtonText}>Skip Image</Text>
      </TouchableOpacity>
      <View style={styles.stencilContainer}>
        {selectedAngleName === "Front View" ||
        selectedAngleName === "Back View" ? (
          <FrontBack fill={align ? "#17FF2D" : "#D2042D"} />
        ) : selectedAngleName === "Left View" ||
          selectedAngleName === "Right View" ? (
          <SideAngle fill={align ? "#17FF2D" : "#D2042D"} />
        ) : selectedAngleName === "3/4th Rear View" ? (
          <RearSide fill={align ? "#17FF2D" : "#D2042D"} />
        ) : selectedAngleName === "3/4th Front View" ? (
          <BackSide fill={align ? "#17FF2D" : "#D2042D"} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
  },
  sideBar: {
    paddingVertical: 30,
    justifyContent: "space-between",
    position: "absolute",
    left: 50,
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
  image: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  text: {
    fontSize: moderateScale(8),
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
    zIndex: 1,
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
