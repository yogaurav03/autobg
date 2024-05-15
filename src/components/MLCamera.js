// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import * as tf from "@tensorflow/tfjs";
// import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
// import { Camera } from "expo-camera";
import { RNCamera } from "react-native-camera";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import * as ScreenOrientation from "expo-screen-orientation";
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
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import Canvas from "react-native-canvas";

// const TensorCamera = cameraWithTensors(Camera);

LogBox.ignoreAllLogs(true);

const MLCamera = forwardRef((props, ref) => {
  const device = useCameraDevice("back");
  const navigation = useNavigation();

  const cameraRef = useRef(null);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [model, setModel] = useState(null);
  let context = useRef(null);
  const canvas = useRef(null);
  const [zoom, setZoom] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsActive(true);
    }, 500);
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

  // function handleCameraStream(images) {
  //   const loop = async () => {
  //     const nextImageTensor = images.next().value;

  //     if (!model || !nextImageTensor) throw new Error("no model");

  //     model
  //       .detect(nextImageTensor)
  //       .then((predictions) => {
  //         console.log("predictions", predictions);
  //         drawRectangle(predictions, nextImageTensor);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });

  //     requestAnimationFrame(loop);
  //   };
  //   loop();
  // }

  // function drawRectangle(predictions, nextImageTensor) {
  //   if (!context.current || !canvas.current) {
  //     console.log("no context or canvas");
  //     return;
  //   }

  //   const scaleWidth = width / nextImageTensor.shape[1];
  //   const scaleHeight = height / nextImageTensor.shape[0];

  //   const flipHorizontal = Platform.OS === "ios" ? false : true;

  //   context.current.clearRect(0, 0, width, height);

  //   predictions.forEach((prediction) => {
  //     const [x, y, width, height] = prediction.bbox;

  //     const boundingBoxX = flipHorizontal
  //       ? canvas.current.width - x * scaleWidth - width * scaleWidth
  //       : x * scaleWidth;
  //     const boundingBoxY = y * scaleHeight;

  //     context.current.strokeRect(
  //       boundingBoxX,
  //       boundingBoxY,
  //       width * scaleWidth,
  //       height * scaleHeight
  //     );

  //     context.current.fillText(
  //       prediction.class,
  //       boundingBoxX - 5,
  //       boundingBoxY - 5
  //     );
  //   });
  // }

  // const handleCanvas = async (can) => {
  //   if (can) {
  //     can.width = width;
  //     can.height = height;
  //     const ctx = can.getContext("2d");
  //     context.current = ctx;
  //     ctx.strokeStyle = "red";
  //     ctx.fillStyle = "red";
  //     ctx.lineWidth = 3;
  //     canvas.current = can;
  //   }
  // };

  let textureDims =
    Platform.OS === "ios"
      ? { height: 1920, width: 1080 }
      : { height: 1200, width: 1600 };

  // useEffect(() => {
  //   (async () => {
  //     await Camera.requestCameraPermissionsAsync();
  //     await tf.ready();
  //     setModel(await cocoSsd.load());
  //   })();
  // }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      ScreenOrientation.unlockAsync();
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
      {/* <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        // onReady={handleCameraStream}
        autorender={true}
        useCustomShadersToResize={false}
      /> */}
      {/* <Camera
        ref={cameraRef}
        style={styles.cameraStyle} // hidden camera
        autoFocus={true}
        onCameraReady={() => console.log("Camera is ready")}
        type={Camera.Constants.Type.back}
      />
      <Canvas style={styles.canvas} ref={handleCanvas} /> */}
      {/* <RNCamera
        ref={cameraRef}
        style={styles.cameraStyle}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        onCameraReady={() => console.log("Camera is ready")}
        ratio={"16:9"}
        zoom={0}
      /> */}
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
      >
        {isCameraReady ? (
          <Text>Camera is ready.</Text>
        ) : (
          <Text>Initializing Camera...</Text>
        )}
      </Camera>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    transform: [
      { rotate: "-90deg" }, // Rotate the camera view
    ],
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
