import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/Entypo";
import Orientation from "react-native-orientation-locker";
import ImagePicker from "react-native-image-crop-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import {
  BackLeftSideView,
  BackRightSideView,
  BackView,
  CameraIcon,
  FrontLeftSideView,
  FrontRightSideView,
  FrontView,
  LeftSideView,
  RightSideView,
  SkipIcon,
} from "../../assets/icons";
import MLCamera from "../../components/MLCamera";
import {
  BackSide,
  FrontBack,
  Leveler,
  RearSide,
  SideAngle,
} from "../../components";
import { APIURLS } from "../../utils/ApiUrl";
import api from "../../utils/Api";
import { useAppState } from "../../context/AppStateContext";
import { moderateScale } from "../../utils/Scaling";
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
import { useIsFocused } from "@react-navigation/native";

const Camera = ({ route, navigation }) => {
  const { state, dispatch } = useAppState();
  const isFocused = useIsFocused();
  const selectedAngleIndex = route?.params?.selectedAngles;
  const selectedInteriorAngleIndex = route?.params?.selectedInteriorAngles;
  const batchId = route?.params?.batchId;
  const selectedTemplateId = route?.params?.selectedTemplateId;
  const isLeftHandSelected = route?.params?.isLeftHandSelected;
  const [cameraCarAngles, setCameraCarAngles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAllColorsSet, setAllColorsSet] = useState(false);
  const [selectedAngleName, setSelectedAngleName] = useState("");
  const [exteriorHeight, setExteriorHeight] = useState(0);
  const [isCentered, setIsCentered] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [width, setWidth] = useState(Dimensions.get("screen").width);

  const [carAngles, setCarAngles] = useState([
    {
      id: 1,
      icon: frontCar,
      name: "Front View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 2,
      icon: rightAngleCar,
      name: "3/4th Front Right View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 3,
      icon: rightSideCar,
      name: "Right View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 4,
      icon: backRightAngleCar,
      name: "3/4th Rear Right View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 5,
      icon: backCar,
      name: "Back View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 6,
      icon: backLeftAngleCar,
      name: "3/4th Rear Left View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 7,
      icon: leftSideCar,
      name: "Left View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 8,
      icon: leftAngleCar,
      name: "3/4th Front Left View",
      color: "",
      uri: "",
      path: "",
    },
  ]);

  const interiorAngles = [
    {
      id: 1,
      icon: <CarWheel width={30} />,
      name: "Car Wheel",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 2,
      icon: <CarTrunk width={30} />,
      name: "Car Trunk",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 3,
      icon: isLeftHandSelected ? (
        <PassengerBackViewLeft width={30} />
      ) : (
        <PassengerBackViewRight width={30} />
      ),
      name: isLeftHandSelected
        ? "Passenger Back View Left"
        : "Passenger Back View Right",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 4,
      icon: isLeftHandSelected ? (
        <PassengerBackViewRight width={30} />
      ) : (
        <PassengerBackViewLeft width={30} />
      ),
      name: isLeftHandSelected
        ? "Passenger Back View Right"
        : "Passenger Back View Left",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 5,
      icon: isLeftHandSelected ? (
        <MidConsoleView width={30} />
      ) : (
        <MidConsoleViewRight width={30} />
      ),
      name: "Mid Console View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 6,
      icon: <CarAcConsole width={30} />,
      name: "Ac Console",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 7,
      icon: <DriverSideView width={30} />,
      name: "Driver Side View",
      color: "",
      uri: "",
      path: "",
    },
    {
      id: 8,
      icon: <PassengerSideView width={30} />,
      name: "Passenger Side View",
      color: "",
      uri: "",
      path: "",
    },
  ];

  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    // Function to update the screen width
    const updateDimensions = () => {
      const { width } = Dimensions.get("screen");
      setWidth(width);
    };

    // Set the initial width
    updateDimensions();

    // Add event listener to update width on dimension change
    Dimensions.addEventListener("change", updateDimensions);

    // Cleanup event listener on component unmount
    return () => {
      // Dimensions.removeEventListener("change", updateDimensions);
      null;
    };
  }, []);

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
    setLayoutReady(true);
  };

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
    setSelectedAngleName(cameraAngles?.[0]?.name);
    setCameraCarAngles(cameraAngles);
  };

  useEffect(() => {
    mergeCameraAngle();
  }, []);

  const cameraRef = useRef(null);

  useEffect(() => {
    // Lock orientation to landscape when screen is focused
    const unsubscribeFocus = navigation.addListener("focus", () => {
      Orientation.lockToLandscape();
    });

    // Unlock or keep landscape when screen is blurred
    const unsubscribeBlur = navigation.addListener("blur", () => {
      Orientation.unlockAllOrientations(); // Adjust if you want a default portrait when leaving
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, isFocused]);

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
          Platform.OS === "ios" ? 360 : 360,
          null,
          true,
          { mode: "contain", onlyScaleDown: false },
          { width: photo.height, height: photo.width }
        );

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
        setLoading(false);
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

  useEffect(() => {
    setExteriorHeight(20);
  }, []);

  const allColorsSet = () => {
    return cameraCarAngles.every((angle) => angle.color !== "");
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
        {item?.arrayType === "exterior" ? (
          <Image
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
            source={item.icon}
          />
        ) : (
          item?.icon
        )}
        <Text
          style={[
            styles.text,
            item.name === selectedAngleName ? styles.selectedAngleTxt : {},
          ]}
        >
          {item.name?.split(" ")[0]}{" "}
          <Text style={styles.viewTxt}>
            {item.name?.split(" ")[1]} {"\n"}
            {item.name?.split(" ")[3]}
          </Text>
        </Text>
        <View
          style={[
            styles.dot,
            { backgroundColor: item.color, borderRadius: 15 },
          ]}
        />
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
      isLeftHandSelected: isLeftHandSelected,
    });
  };

  const addedColorsCount = cameraCarAngles.filter(
    (angle) => angle.color !== ""
  ).length;

  useEffect(() => {
    if (cameraCarAngles.length > 0) {
      const allColorsSet = cameraCarAngles.every((angle) => angle.color !== "");
      if (allColorsSet) {
        setAllColorsSet(true);
        goToCheckImages();
      }
    }
  }, [cameraCarAngles]);

  const selectedInteriorAngles = () => {
    if (
      selectedAngleName === "Passenger Back View Right" ||
      selectedAngleName === "Car Wheel" ||
      selectedAngleName === "Ac Console" ||
      selectedAngleName === "Car Trunk" ||
      selectedAngleName === "Passenger Back View Left" ||
      selectedAngleName === "Mid Console View" ||
      selectedAngleName === "Passenger Side View" ||
      selectedAngleName === "Driver Side View"
    ) {
      setIsCentered(true);
    }
  };

  useEffect(() => {
    selectedInteriorAngles();
  }, [selectedAngleName]);

  const openSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderStyle}>
          <ActivityIndicator
            size={80}
            color={MD2Colors.black}
            animating={true}
          />
        </View>
      )}
      <View style={styles.container}>
        <MLCamera ref={cameraRef} />
      </View>
      <View style={styles.centerButtons}>
        {/* <TouchableOpacity onPress={() => goToCheckImages()}>
          <View style={styles.galleryImg} />
        </TouchableOpacity> */}

        <View style={{ height: "20%" }} />
      </View>
      <View style={styles.sideBar}>
        <TouchableOpacity
          style={styles.sideBarContainer}
          onPress={() => openSideBar()}
        >
          <View>
            {isSideBarOpen ? (
              <Icon name="eye" size={moderateScale(20)} color="#eee" />
            ) : (
              <Icon
                name="eye-with-line"
                size={moderateScale(20)}
                color="#eee"
              />
            )}
          </View>
          <Text style={styles.showCarText}>
            {isSideBarOpen ? "Show" : "Hide"} car angle list
          </Text>
        </TouchableOpacity>
        <View style={styles.sideBarNum}>
          <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700" }}>
            {addedColorsCount}/{cameraCarAngles?.length}
          </Text>
        </View>

        {!isSideBarOpen && (
          <View style={styles.sideBarCard}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cameraCarAngles}
              renderItem={renderItem}
              keyExtractor={(item) => item.newId.toString()}
            />
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          right: "10%",
          top: "10%",
          zIndex: 2,
        }}
      >
        <Icon name="circle-with-cross" size={moderateScale(30)} />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!isCentered}
        onPress={takePicture}
        style={[styles.shutterButton, { opacity: !isCentered ? 0.5 : 1 }]}
      >
        <CameraIcon height={60} width={60} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={isAllColorsSet ? goToCheckImages : skipAndSelectNextAngle}
        style={styles.specialButton}
      >
        <SkipIcon />
        <Text style={styles.specialButtonText}>
          {!isAllColorsSet ? "Skip Image" : "Check Images"}
        </Text>
      </TouchableOpacity>
      {selectedAngleName === "Passenger Back View Right" ||
      selectedAngleName === "Car Wheel" ||
      selectedAngleName === "Ac Console" ||
      selectedAngleName === "Car Trunk" ||
      selectedAngleName === "Passenger Back View Left" ||
      selectedAngleName === "Mid Console View" ||
      selectedAngleName === "Passenger Side View" ||
      selectedAngleName === "Driver Side View" ? null : (
        <Leveler setIsCentered={setIsCentered} />
      )}
      <View onLayout={onLayout} style={styles.stencilContainer}>
        {layoutReady && (
          <>
            {selectedAngleName === "Front View" ||
            selectedAngleName === "Back View" ? (
              <FrontBack fill={isCentered ? "#17FF2D" : "#D2042D"} />
            ) : selectedAngleName === "Left View" ||
              selectedAngleName === "Right View" ? (
              <SideAngle fill={isCentered ? "#17FF2D" : "#D2042D"} />
            ) : selectedAngleName === "3/4th Front Left View" ||
              selectedAngleName === "3/4th Rear Right View" ? (
              <>
                <RearSide fill={isCentered ? "#17FF2D" : "#D2042D"} />
                {/* <View
                  style={{
                    position: "absolute",
                    right: -40,
                    top: 0,
                    bottom: 0,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    <View style={{ position: "relative" }}>
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          borderLeftWidth: 280,
                          borderRightWidth: 0, // Match the width of the container
                          borderBottomWidth: 170, // Adjust height to maintain the right-angle triangle
                          borderTopWidth: 0,
                          borderStyle: "solid",
                          borderBottomColor: "#00BDFF80",
                          borderRightColor: "transparent",
                          borderLeftColor: "transparent",
                        }}
                      />
                      <View
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          width: Math.sqrt(Math.pow(280, 2) + Math.pow(170, 2)),
                          height: "24.5%",
                          borderStyle: "solid",
                          borderTopWidth: 4,
                          borderTopColor: isCentered ? "#17FF2D" : "#D2042D",
                          transform: [{ rotate: "-31.3deg" }],
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            backgroundColor: isCentered ? "#17FF2D" : "#D2042D",
                            padding: 2,
                            borderRadius: 20,
                            fontSize: 12,
                            top: "-15%",
                            width: 150,
                            textAlign: "center",
                          }}
                        >
                          Match the line with tire
                        </Text>
                      </View>
                    </View>
                    <View>
                      <View
                        style={{
                          width: 150,
                          height: "55%",
                          backgroundColor: "#00BDFF80",
                          borderLeftWidth: 4,
                          borderLeftColor: isCentered ? "#17FF2D" : "#D2042D",
                        }}
                      />
                      <View
                        style={{
                          width: 150,
                          height: "45%",
                          backgroundColor: "#00BDFF80",
                        }}
                      />
                    </View>
                  </View>
                </View> */}
              </>
            ) : selectedAngleName === "3/4th Front Right View" ||
              selectedAngleName === "3/4th Rear Left View" ? (
              <View
                style={{
                  position: "absolute",
                  left: Platform.OS === "ios" ? -10 : width > 1050 ? -40 : -25,
                }}
              >
                <BackSide fill={isCentered ? "#17FF2D" : "#D2042D"} />
              </View>
            ) : // <View
            //   style={{
            //     position: "absolute",
            //     left: -40, // Changed to left
            //     top: 0,
            //     bottom: 0,
            //   }}
            // >
            //   <View
            //     style={{
            //       flexDirection: "row-reverse",
            //       alignItems: "flex-end",
            //     }}
            //   >
            //     <View style={{ position: "relative" }}>
            //       <View
            //         style={{
            //           width: 0,
            //           height: 0,
            //           borderRightWidth: 280, // Changed to borderRightWidth
            //           borderLeftWidth: 0,
            //           borderBottomWidth: 170,
            //           borderTopWidth: 0,
            //           borderStyle: "solid",
            //           borderBottomColor: "#00BDFF80",
            //           borderLeftColor: "transparent",
            //           borderRightColor: "transparent",
            //         }}
            //       />
            //       <View
            //         style={{
            //           position: "absolute",
            //           right: 0, // Changed to right
            //           bottom: 0,
            //           width: Math.sqrt(Math.pow(280, 2) + Math.pow(170, 2)),
            //           height: "24.5%",
            //           borderStyle: "solid",
            //           borderTopWidth: 4,
            //           borderTopColor: isCentered ? "#17FF2D" : "#D2042D",
            //           transform: [{ rotate: "31.3deg" }],
            //           alignItems: "center",
            //         }}
            //       >
            //         <Text
            //           style={{
            //             color: "white",
            //             fontWeight: "bold",
            //             backgroundColor: isCentered ? "#17FF2D" : "#D2042D",
            //             padding: 2,
            //             borderRadius: 20,
            //             fontSize: 12,
            //             top: "-15%",
            //             width: 150,
            //             textAlign: "center",
            //           }}
            //         >
            //           Match the line with tire
            //         </Text>
            //       </View>
            //     </View>
            //     <View>
            //       <View
            //         style={{
            //           width: 150,
            //           height: "55%",
            //           backgroundColor: "#00BDFF80",
            //           borderRightWidth: 4, // Changed to borderRightWidth
            //           borderRightColor: isCentered ? "#17FF2D" : "#D2042D", // Changed to borderRightColor
            //         }}
            //       />
            //       <View
            //         style={{
            //           width: 150,
            //           height: "45%",
            //           backgroundColor: "#00BDFF80",
            //         }}
            //       />
            //     </View>
            //   </View>
            // </View>
            selectedAngleName === "Car Wheel" ? (
              <CarWheel width={layout.width} height={layout.height} />
            ) : selectedAngleName === "Ac Console" ? (
              <CarAcConsole width={layout.width} height={layout.height} />
            ) : selectedAngleName === "Car Trunk" ? (
              <CarTrunk width={layout.width} height={layout.height} />
            ) : selectedAngleName === "Passenger Back View Left" ? (
              <PassengerBackViewLeft
                width={layout.width}
                height={layout.height}
              />
            ) : selectedAngleName === "Passenger Back View Right" ? (
              <PassengerBackViewRight
                width={layout.width}
                height={layout.height}
              />
            ) : selectedAngleName === "Mid Console View" ? (
              isLeftHandSelected ? (
                <MidConsoleView width={layout.width} height={layout.height} />
              ) : (
                <MidConsoleViewRight
                  width={layout.width}
                  height={layout.height}
                />
              )
            ) : selectedAngleName === "Passenger Side View" ? (
              <PassengerSideView width={layout.width} height={layout.height} />
            ) : selectedAngleName === "Driver Side View" ? (
              <DriverSideView width={layout.width} height={layout.height} />
            ) : null}
          </>
        )}
      </View>
      <View
        style={{
          ...styles.stencilContainer,
          top: 0,
        }}
        onLayout={onLayout}
      >
        {layoutReady && (
          <>
            {selectedAngleName === "Back View" ? (
              <View style={{ marginTop: width < 740 ? 60 : 20 }}>
                <BackView width={layout.width} height={layout.height - 50} />
              </View>
            ) : selectedAngleName === "Front View" ? (
              <View style={{ marginTop: width < 740 ? 60 : 20 }}>
                <FrontView width={layout.width} height={layout.height - 50} />
              </View>
            ) : selectedAngleName === "Left View" ? (
              <View
                style={{
                  marginLeft: 50,
                  marginTop:
                    Platform.OS === "ios"
                      ? width > 850
                        ? 10
                        : 10
                      : width > 930
                      ? 10
                      : width < 740
                      ? 30
                      : 20,
                  transform: [{ rotate: "1deg" }],
                }}
              >
                <LeftSideView
                  width={layout.width - 120}
                  height={layout.height}
                />
              </View>
            ) : selectedAngleName === "Right View" ? (
              <View
                style={{
                  marginLeft: 50,
                  marginTop:
                    Platform.OS === "ios"
                      ? width > 850
                        ? 10
                        : 10
                      : width > 930
                      ? 10
                      : width < 740
                      ? 30
                      : 20,
                  transform: [{ rotate: "-1.5deg" }],
                }}
              >
                <RightSideView
                  width={layout.width - 120}
                  height={layout.height}
                />
              </View>
            ) : selectedAngleName === "3/4th Front Left View" ? (
              <View
                style={{
                  marginTop: 5,
                }}
              >
                <FrontLeftSideView
                  width={layout.width}
                  height={layout.height - 65}
                />
              </View>
            ) : selectedAngleName === "3/4th Front Right View" ? (
              <View
                style={{
                  marginLeft:
                    width < 740 ? 40 : width > 865 ? 10 : width > 860 ? 10 : 0,
                  marginTop: 5,
                }}
              >
                <FrontRightSideView
                  width={layout.width}
                  height={layout.height - 65}
                />
              </View>
            ) : selectedAngleName === "3/4th Rear Left View" ? (
              <View
                style={{
                  marginLeft:
                    width < 740 ? 40 : width > 865 ? 10 : width > 860 ? 10 : 0,
                  marginTop: 5,
                }}
              >
                <BackRightSideView
                  width={layout.width}
                  height={layout.height - 65}
                />
              </View>
            ) : selectedAngleName === "3/4th Rear Right View" ? (
              <View style={{ marginTop: 5 }}>
                <BackLeftSideView
                  width={layout.width}
                  height={layout.height - 65}
                />
              </View>
            ) : null}
          </>
        )}
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
    zIndex: 2,
  },
  sideBar: {
    paddingVertical: 30,
    position: "absolute",
    left: Platform.OS === "android" ? 0 : 50,
    zIndex: 2,
    top: 0,
    bottom: 0,
  },
  sideBarContainer: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginBottom: 10,
  },
  showCarText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    paddingLeft: 10,
  },
  sideBarNum: {
    position: "absolute",
    top: "12%",
    left: "110%",
    flexDirection: "row",
    alignItems: "center",
  },
  sideBarCard: {
    borderWidth: 0.5,
    borderColor: "#EFEFEF",
    borderRadius: 12,
    padding: 6,
    marginBottom: 50,
    backgroundColor: "#EFEFEF30",
  },
  itemContainer: {
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 10,
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
    borderRadius: 15,
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
  shutterButton: {
    position: "absolute",
    right: "10%",
    top: "45%",
    zIndex: 2,
  },
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
    top: 0,
    zIndex: 1,
  },
});

export default Camera;
