import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  FlatList,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import { LeftArrow } from "../../assets/icons";
import Orientation from "react-native-orientation-locker";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from "react-native-fs";
import moment from "moment";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { useAppState } from "../../context/AppStateContext";
import { moderateScale } from "../../utils/Scaling";
import { failedImg } from "../../assets/images";
import { errorIcon } from "../../assets/lottie";

const ProcessTray = ({ navigation, route }) => {
  const historyData = route.params?.historyData;
  const screenName = route.params?.screenName;
  const { state } = useAppState();
  const [imageData, setImageData] = useState(null);
  const collectionCreatedAt = new Date(
    historyData?.collectionData?.collectionCreatedAt
  );
  const collectionUpdatedAt = new Date(
    historyData?.collectionData?.collectionUpdatedAt
  );
  const deliveredTime = collectionUpdatedAt - collectionCreatedAt;

  const totalSeconds = Math.floor(deliveredTime / 1000);
  const deliveredTimehours = Math.floor(totalSeconds / 3600);
  const deliveredTimeminutes = Math.floor((totalSeconds % 3600) / 60);
  const deliveredTimeseconds = totalSeconds % 60;

  let formattedTimeDifference = "";

  if (deliveredTimehours > 0) {
    formattedTimeDifference += `${deliveredTimehours} hour${
      deliveredTimehours > 1 ? "s" : ""
    } `;
  }

  if (deliveredTimeminutes > 0) {
    formattedTimeDifference += `${deliveredTimeminutes} min${
      deliveredTimeminutes > 1 ? "s" : ""
    } `;
  }

  if (deliveredTimeseconds > 0) {
    formattedTimeDifference += `${deliveredTimeseconds} sec${
      deliveredTimeseconds > 1 ? "s" : ""
    }`;
  }

  const date = collectionCreatedAt.toISOString().split("T")[0];
  const time = collectionCreatedAt.toTimeString().split(" ")[0];
  const collectionUpdatedTime = collectionUpdatedAt
    .toTimeString()
    .split(" ")[0];

  const parts = collectionUpdatedTime.split(":");

  // Extract minutes and seconds parts
  const minutes = parts[0];
  const seconds = parts[1];

  // Format the output
  const formattedTime = `${minutes} min ${seconds} sec`;

  const getImages = async () => {
    if (state.token) {
      const response = await api.get(
        APIURLS.getImages(historyData?.collectionData?.collectionId),
        state.token
      );
      setImageData(response);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

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

  const downloadImageHit = async () => {
    if (state.token) {
      const response = await api.post(
        APIURLS.downloadImage(historyData?.collectionData?.collectionId),
        state.token
      );
      if (response?.code === 1) {
      }
    }
  };

  const renderImages = ({ item }) => (
    <TouchableOpacity
      style={{ ...styles.imageStyle, width: "49%" }}
      key={item?.data?.id}
      onPress={() =>
        navigation.navigate("PreviewScreen", {
          imageData: item?.data?.doneImgUrl,
          currentIndex: 0,
        })
      }
    >
      <Image
        source={{ uri: item?.data?.doneImgUrl }}
        style={styles.imageStyle}
      />
    </TouchableOpacity>
  );

  const imageUrl = {
    uri: "https://media.voguebusiness.com/photos/5ef6493adf1073db3375835d/master/pass/kanye-west-gap-news-voguebus-mert-alas-and-marcus-piggott-june-20-story.jpg",
  };

  const handleDownload = async () => {
    let date = moment().format("YYYYMMDDhhmmss");
    let fileUri = RNFS.DocumentDirectoryPath + `/${date}.jpg`; // Using react-native-fs path
    for (const image of imageData?.processedImages) {
      try {
        const res = await RNFS.downloadFile({
          fromUrl: image.data.doneImgUrl,
          toFile: fileUri,
        }).promise;
        saveFile(fileUri);
        downloadImageHit();
      } catch (err) {
        console.log("FS Err: ", err);
      }
    }
  };

  const saveFile = async (fileUri) => {
    try {
      // Save the file to the device's camera roll/gallery using CameraRoll
      await CameraRoll.saveAsset(fileUri, { type: "photo" });
      console.log("File saved to gallery:", fileUri);
      Alert.alert("All images have been saved to the gallery.");
    } catch (err) {
      console.log("Save err: ", err);
    }
  };

  const handleDownloadAndroid = async () => {
    const images = imageData?.processedImages || []; // Safety check
    const assets = [];

    for (const image of images) {
      const date = moment().format("YYYYMMDDhhmmss");
      const fileUri = FileSystem.documentDirectory + `${date}.jpg`;

      try {
        const response = await RNFS.downloadFile({
          fromUrl: image.data.doneImgUrl,
          toFile: fileUri,
        }).promise;
        const asset = await saveFileAndroid(response);
        if (asset) {
          assets.push(asset);
          downloadImageHit();
        }
      } catch (err) {
        console.log("FS Err: ", err);
      }
    }

    if (assets.length > 0) {
      try {
        // After all images are downloaded, create or update the album
        await updateAlbum(assets);
        ("All images have been downloaded and saved.");
      } catch (err) {
        console.log("Album Update Error:", err);
      }
    } else {
      Alert.alert("No images were downloaded.");
    }
  };

  const saveFileAndroid = async (fileUri) => {
    try {
      // Save the file to the camera roll using CameraRoll
      const saved = await CameraRoll.saveAsset(fileUri, {
        type: "photo",
      });
      return saved;
    } catch (err) {
      Alert.alert("Please allow permissions to download.");
      return null; // Return null if permissions are not granted
    }
  };

  const updateAlbum = async (assets) => {
    try {
      // Create album or add to existing album
      const albumName = "Download";
      const firstAsset = assets[0];

      // Check if the album exists. If not, create it.
      const existingAlbum = await CameraRoll.getAlbums();
      const album = existingAlbum.find((a) => a.title === albumName);

      if (!album) {
        // If the album doesn't exist, create it
        await CameraRoll.saveAsset(firstAsset, { type: "photo" }); // Saving first image to create the album
        Alert.alert("Album created successfully");
      }

      // Add all assets to the album
      for (const asset of assets) {
        await CameraRoll.saveAsset(asset, { type: "photo" });
      }

      Alert.alert("All images have been saved to the gallery.");
    } catch (err) {
      console.error("Error updating album:", err);
      Alert.alert("Error updating album.");
    }
  };

  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      <View
        style={{
          ...styles.container,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconStyle}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.creditContainer}>
            <Image
              source={{
                uri: imageData?.processedImages?.[0]?.data?.doneImgUrl,
              }}
              style={styles.imgStyle}
            />
            <View style={styles.subContainer}>
              <Text numberOfLines={1} style={styles.bottomText}>
                {historyData?.collectionData?.numberPlate}
              </Text>
              <View style={styles.timeContainer}>
                <Text style={styles.timeTxt}>{time}</Text>
                <Text style={styles.timeTxt}>{date}</Text>
              </View>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.deliveredTxt}>
                Delivered in{" "}
                <Text style={styles.timeStyle}>
                  {formattedTimeDifference?.trim()}
                </Text>
              </Text>
            </View>
            <View style={styles.photoContainer}>
              <Text style={styles.numberTxt}>
                {historyData?.processedImgCount === 0
                  ? historyData?.failedImgCount
                  : historyData?.processedImgCount}
              </Text>
              <Text style={styles.photosTxt}>Photos</Text>
            </View>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.imagesContainer}>
            {imageData?.processedImages?.length !== 0 ? (
              <FlatList
                renderItem={renderImages}
                data={imageData?.processedImages}
                numColumns={2}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View style={{ alignSelf: "center" }}>
                <LottieView
                  ref={(animation) => {
                    animationRef = animation;
                  }}
                  source={errorIcon}
                  autoPlay
                  loop
                  style={{
                    width: 200,
                    height: 200,
                    zIndex: 1,
                    marginBottom: -70,
                  }}
                />
              </View>
              // <Text style={styles.bottomText}>Failed Images Found</Text>
            )}
          </View>
        </View>
      </View>
      {screenName !== "History" &&
        (imageData?.processedImages.length === 0 ? null : (
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("QAScreenScreen", {
                  imageData: imageData?.processedImages,
                  historyData: historyData,
                })
              }
              style={styles.qaContainer}
            >
              <Text style={styles.btnText}>Check for Q&A</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={
                Platform.OS === "ios" ? handleDownload : handleDownloadAndroid
              }
              style={styles.downloadContainer}
            >
              <Text style={styles.btnText}>Download All</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  btnText: {
    fontWeight: "bold",
    color: "#FFF",
    fontSize: moderateScale(14),
  },
  qaContainer: {
    backgroundColor: "#33A3FF",
    padding: 15,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    paddingHorizontal: 35,
  },
  downloadContainer: {
    backgroundColor: "#8AEB0F",
    padding: 15,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    paddingHorizontal: 35,
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 40,
    width: "90%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    padding: 10,
    marginVertical: 5,
    height: 100,
    width: "100%",
  },
  creditContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
  },
  subContainer: {
    marginLeft: 10,
    width: "60%",
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#004E8E",
    marginLeft: 10,
  },
  bottomText: {
    fontSize: moderateScale(18),
    color: "#8A93A4",
  },
  timeStyle: {
    color: "#66BAFF",
    fontWeight: "700",
    fontSize: moderateScale(10),
  },
  deliveredTxt: {
    color: "#8A93A4",
    fontWeight: "700",
    fontSize: moderateScale(10),
  },
  timeTxt: {
    color: "#2499DA",
    fontSize: moderateScale(8),
    marginRight: 5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
    justifyContent: "flex-end",
  },
  dateContainer: {
    alignItems: "center",
    marginLeft: 10,
    width: "40%",
  },
  photoContainer: {
    alignItems: "center",
    marginLeft: 10,
  },
  numberTxt: {
    color: "#33A3FF",
    fontSize: moderateScale(22),
    fontWeight: "700",
  },
  photosTxt: {
    color: "#33A3FF",
    fontSize: moderateScale(10),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#8BED0F",
    marginRight: 5,
  },
  statusText: {
    fontSize: moderateScale(12),
    color: "#69BB01",
  },
  historyContainer: {
    backgroundColor: "#C7EAFF",
    height: "80%",
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
  },
  imagesContainer: {
    backgroundColor: "#E2EFF890",
    padding: 10,
    borderRadius: 10,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imgStyle: {
    height: 80,
    width: 80,
  },
  imageStyle: {
    height: 100,
    borderRadius: 10,
    margin: 2,
  },
});

export default ProcessTray;
