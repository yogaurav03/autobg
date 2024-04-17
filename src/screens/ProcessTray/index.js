import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  FlatList,
} from "react-native";
import { LeftArrow } from "../../assets/icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ScreenOrientation from "expo-screen-orientation";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { useAppState } from "../../context/AppStateContext";
import { moderateScale } from "../../utils/Scaling";

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

  const renderImages = ({ item }) => (
    <Image source={{ uri: item?.data?.doneImgUrl }} style={styles.imageStyle} />
  );

  useEffect(() => {
    const lockOrientation = async () => {
      // Lock the orientation to potrait
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
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
              <Text style={styles.timeStyle}>{formattedTime}</Text>
              <Text style={styles.deliveredTxt}>Delivered in</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.numberTxt}>
                {historyData?.processedImgCount}
              </Text>
              <Text style={styles.photosTxt}>Photos</Text>
            </View>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.imagesContainer}>
            <FlatList
              renderItem={renderImages}
              data={imageData?.processedImages}
              numColumns={2}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </View>
      {screenName !== "History" && (
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("QAScreenScreen", {
                imageData: imageData?.processedImages,
              })
            }
            style={styles.qaContainer}
          >
            <Text style={styles.btnText}>Check for Q&A</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadContainer}>
            <Text style={styles.btnText}>Download All</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "android" ? 10 : 20,
    backgroundColor: "#EAF7FF", // Background color of the screen
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
  },
  creditContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
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
    fontSize: moderateScale(12),
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
  },
  dateContainer: {
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
    width: "49%",
    borderRadius: 10,
    margin: 2,
  },
});

export default ProcessTray;
