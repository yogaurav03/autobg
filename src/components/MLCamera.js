import { Camera, useCameraDevice } from "react-native-vision-camera";
import Orientation from "react-native-orientation-locker";
import React, {
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  LogBox,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MD2Colors } from "react-native-paper";
// import Canvas from "react-native-canvas";

// const TensorCamera = cameraWithTensors(Camera);

LogBox.ignoreAllLogs(true);

const MLCamera = forwardRef((props, ref) => {
  const device = useCameraDevice("back");
  const navigation = useNavigation();

  const cameraRef = useRef(null);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [isActive, setIsActive] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsActive(false);
    }, 200);
  }, []);

  useImperativeHandle(ref, () => ({
    takePicture: async () => {
      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true, zoom: 0 };
        return await cameraRef.current.takePhoto(options);
      }
    },
  }));

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    Dimensions.addEventListener("change", onChange);

    return () => {
      null;
    };
  }, []);

  const { width, height } = dimensions;

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

  if (device == null) return <ActivityIndicator size={"large"} />;

  return (
    <View
      style={[
        styles.container,
        { width: height, height: width, alignSelf: "center" },
      ]}
    >
      {isActive ? (
        <View style={styles.loaderStyle}>
          <ActivityIndicator
            size={80}
            color={MD2Colors.black}
            animating={true}
          />
        </View>
      ) : (
        <Camera
          ref={cameraRef}
          style={styles.cameraStyle}
          device={device}
          isActive={true}
          onInitialized={() => setIsCameraReady(true)}
          onError={(error) => console.log("Camera error:", error)}
          video={true}
          photo={true}
          audio={false}
          resizeMode={"contain"}
          exposure={Platform.OS === "ios" ? -0.1 : 0}
        >
          {isCameraReady ? (
            <Text>Camera is ready.</Text>
          ) : (
            <Text>Initializing Camera...</Text>
          )}
        </Camera>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // transform: [
    //   { rotate: "-90deg" }, // Rotate the camera view
    // ],
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
  camera: {
    flex: 1,
  },
  canvas: {
    position: "absolute",
    zIndex: 1000000,
    width: "100%",
    height: "100%",
  },
  cameraStyle: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
});

export default MLCamera;
