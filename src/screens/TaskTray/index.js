import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  FlatList,
  RefreshControl,
  StatusBar,
} from "react-native";
import Orientation from "react-native-orientation-locker";
import { LeftArrow, RightArrow } from "../../assets/icons";
import { image1, image2, image3 } from "../../assets/images";
import { useNavigation } from "@react-navigation/native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useAppState } from "../../context/AppStateContext";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { moderateScale } from "../../utils/Scaling";
import Loader from "../../components/Loader";

const TaskTray = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useAppState();
  const [refreshing, setRefreshing] = useState(false);
  const [taskTrayData, setTaskTrayData] = useState(null);
  const [loader, setLoader] = useState(false);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const fetchTaskTray = async () => {
    try {
      setLoader(true);
      if (state.token) {
        const response = await api.get(APIURLS.getTaskTray, state.token);

        const withTimers = response.data.map((item) => ({
          ...item,
          startTime: Date.now(), // Set the current time as start time
          duration: 20 * 60, // Set duration for 15 minutes in seconds
          remainingTime: 20 * 60, // Initially set remaining time to full duration
        }));

        dispatch({ type: "TASK_TRAY_DATA", payload: withTimers });
        setTaskTrayData(withTimers);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);

      console.error("Failed to fetch user data:", error);
    }
  };

  const getRemainingTime = (startTime) => {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // in seconds
    const totalDuration = 20 * 60; // 15 minutes in seconds
    const remainingTime = totalDuration - elapsedTime;
    return Math.max(remainingTime, 0); // return 0 if the time is negative
  };

  useEffect(() => {
    fetchTaskTray();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTaskTray();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const lockOrientation = async () => {
      // Lock the orientation to potrait
      Orientation.lockToPortrait();
    };
    lockOrientation();
  }, []);

  const renderItem = ({ item }) => {
    const collectionCreatedAt = new Date(
      item.collectionData?.collectionCreatedAt
    );
    const date = collectionCreatedAt.toISOString().split("T")[0];
    const time = collectionCreatedAt.toTimeString().split(" ")[0];

    const remainingTime = getRemainingTime(item?.startTime);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProcessTrayScreen", {
            historyData: item,
            screenName: "TaskTray",
          })
        }
        style={styles.blueContainer}
        disabled={item?.collectionData?.isEmpWorkDone === 0}
      >
        {/* Individual list container */}
        <View style={styles.listContainer}>
          {/* Left side of list container */}
          <View style={styles.leftListContainer}>
            <Image source={image1} style={styles.listImage} />
            <Image source={image2} style={styles.listImage} />
            <View style={styles.totalPhotosContainer}>
              <Image source={image3} style={styles.overlayImage} />
              <Text style={styles.totalPhotosText}>
                {item?.processedImgCount === 0
                  ? item?.failedImgCount
                  : item?.processedImgCount}{" "}
                {"\n"} <Text style={styles.photosText}>Photos</Text>
              </Text>
            </View>
          </View>

          {/* Center of list container */}
          <View style={styles.centerListContainer}>
            <Text style={styles.nameText} numberOfLines={2}>
              {item?.collectionData?.numberPlate}
            </Text>
            <Text style={styles.dateTimeText}>
              {time} {date}
            </Text>
          </View>

          {/* Right side of list container */}
          {item?.collectionData?.isEmpWorkDone === 0 ? (
            <CountdownCircleTimer
              size={70}
              strokeWidth={6}
              isPlaying
              duration={item.duration}
              colors={["#32A1FC", "#F7B801", "#A30000", "#A30000"]}
              initialRemainingTime={remainingTime}
              colorsTime={[7, 5, 2, 0]}
            >
              {({ remainingTime }) => (
                <Text style={styles.timeLeft}>{formatTime(remainingTime)}</Text>
              )}
            </CountdownCircleTimer>
          ) : (
            <View style={{ marginRight: 10 }}>
              <RightArrow />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      {loader && <Loader />}
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.userName}>Task Tray</Text>
            <Text style={styles.welcomeText}>
              All Pending and ongoing processes {"\n"} are listed below.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.taskTrayContainer}
          >
            <LeftArrow height={13} />
            <Text style={styles.taskTrayText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <FlatList
            data={state?.taskTrayData}
            renderItem={renderItem}
            keyExtractor={(item) => item?.collectionData?.collectionId}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: moderateScale(12),
    fontWeight: "500",
    color: "#B3B3B3", // Text color
  },
  userName: {
    fontSize: moderateScale(28),
    color: "#2492FE", // Text color
    fontWeight: "bold",
  },
  taskTrayContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  taskTrayText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#CBCBCB", // Text color
    marginLeft: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  leftContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  timeLeft: {
    color: "#2499DA",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  bottomText: {
    fontSize: moderateScale(14),
    color: "#9D9D9D",
  },
  bottomText1: {
    fontSize: moderateScale(16),
    color: "#7D7D7D",
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconContainer: {
    borderColor: "grey",
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
  },
  rowIcon: {
    width: 20,
    height: 20,
  },
  rowText: {
    fontSize: moderateScale(26),
    color: "#7D7D7D30",
    fontWeight: "bold",
  },
  rightContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flex: 1,
    marginLeft: 10,
  },
  planText: {
    fontSize: moderateScale(16),
    color: "#7D7D7D",
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: moderateScale(16),
    color: "#7D7D7D",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#8BED0F",
    paddingHorizontal: 5,
    paddingVertical: 2,
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
  numberText: {
    fontSize: moderateScale(16),
    color: "#333",
    marginTop: 10,
  },
  sliderContainer: {
    height: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  fillBlue: {
    flex: 78,
    backgroundColor: "#32A1FC",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  fillGrey: {
    flex: 22,
    backgroundColor: "#D6D6D6",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  historyContainer: {
    backgroundColor: "#C7EAFF",
    height: "100%",
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 100,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyText: {
    color: "#0076EA",
    fontWeight: "bold",
    fontSize: moderateScale(16),
    marginLeft: 10,
  },
  viewAllContainer: {
    backgroundColor: "#2499DA",
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: moderateScale(14),
  },
  blueContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    height: 100,
    justifyContent: "center",
    marginVertical: 2,
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftListContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: -55,
  },
  totalPhotosContainer: {
    position: "relative",
  },
  overlayImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  totalPhotosText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    color: "white",
    fontSize: moderateScale(24),
    textAlign: "center",
    fontWeight: "bold",
  },
  photosText: {
    fontSize: moderateScale(12),
    fontWeight: "500",
  },
  centerListContainer: {
    flex: 1,
    marginLeft: 10,
  },
  nameText: {
    fontSize: moderateScale(16),
    color: "#8A93A4",
    fontWeight: "700",
  },
  dateTimeText: {
    fontSize: moderateScale(12),
    color: "#CACACA",
    marginTop: 5,
  },
});

export default TaskTray;
