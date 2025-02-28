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
import { HistoryIcon, RightArrow, TaskTray, TwoBall } from "../../assets/icons";
import { image1, image2, image3 } from "../../assets/images";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";
import { useAppState } from "../../context/AppStateContext";
import { APIURLS } from "../../utils/ApiUrl";
import api from "../../utils/Api";
import { moderateScale } from "../../utils/Scaling";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../components/Loader";

const Home = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { state, dispatch } = useAppState();
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loader, setLoader] = useState(false);

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Update context or global state to reflect logout
      dispatch({ type: "MAIN_CONTENT", payload: "HomeScreen" });
      dispatch({ type: "TOKEN", payload: "" });
      await AsyncStorage.setItem("isFirstInstall", "true");
    } catch (error) {
      console.error("Logout failed", error);
      // Handle any errors here
    }
  };

  const fetchUserData = async () => {
    try {
      if (state.token) {
        const response = await api.get(APIURLS.getUser, state.token);
        if (response?.message === "JWT token expired") {
          handleLogout();
        } else {
          dispatch({ type: "PROFILE_DATA", payload: response.data });
          setUserData(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const getOrInitStartTime = async (collectionId) => {
    const key = `startTime_${collectionId}`;
    let storedTime = await AsyncStorage.getItem(key);
    if (!storedTime) {
      const newStartTime = Date.now();
      await AsyncStorage.setItem(key, newStartTime.toString());
      return newStartTime;
    }
    return parseInt(storedTime, 10);
  };

  // Calculate remaining time based on persistent startTime
  const getRemainingTime = (startTime) => {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); // seconds
    const totalDuration = 20 * 60; // 20 minutes in seconds
    const remainingTime = totalDuration - elapsedTime;

    return Math.max(remainingTime, 0);
  };

  const fetchHistoryData = async () => {
    try {
      setLoader(true);
      if (state.token) {
        const response = await api.get(APIURLS.getTaskTray, state.token);
        const withTimers = await Promise.all(
          response?.data?.map(async (item) => {
            const startTime = await getOrInitStartTime(
              item?.collectionData?.collectionId
            );
            const remainingTime = getRemainingTime(startTime);
            return {
              ...item,
              startTime,
              duration: 20 * 60,
              remainingTime,
            };
          })
        );
        setHistoryData(withTimers);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);

      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchHistoryData();
  }, [isFocused]);

  useEffect(() => {
    // Lock the orientation to landscape
    Orientation.lockToPortrait();

    // Clean up the orientation lock on component unmount
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistoryData();
    setRefreshing(false);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const renderItem = ({ item, index }) => {
    const collectionCreatedAt = new Date(
      item?.collectionData?.collectionCreatedAt
    );
    const date = collectionCreatedAt?.toISOString()?.split("T")[0];
    const time = collectionCreatedAt?.toTimeString()?.split(" ")[0];

    const isLastItem = index === historyData?.length - 1;

    const remainingTime = getRemainingTime(item?.startTime);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProcessTrayScreen", {
            historyData: item,
            screenName: "TaskTray",
          })
        }
        disabled={item?.collectionData?.isEmpWorkDone === 0}
        style={[styles.blueContainer, isLastItem ? styles.lastItemStyle : null]}
      >
        {/* Individual list container */}
        <View style={styles.listContainer}>
          {/* Left side of list container */}
          <View style={styles.leftListContainer}>
            <Image source={image1} style={styles.listImage} />
            <Image source={image2} style={styles.listImage} />
            <View style={styles.totalPhotosContainer}>
              <Image source={image3} style={styles.overlayImage} />
              <View style={styles.totalPhotosText}>
                <Text
                  style={{
                    color: "white",
                    fontSize: moderateScale(24),
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {item?.processedImgCount === 0
                    ? item?.failedImgCount
                    : item?.processedImgCount}
                  {"\n"} <Text style={styles.photosText}>Photos</Text>
                </Text>
              </View>
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

  const isCurrentCountPresent = userData?.userDetails?.currentCredits < 10;

  const totalCredits = userData?.userDetails?.totalCredits;
  const currentCredits =
    userData?.userDetails?.currentCredits === 0
      ? 0.1
      : userData?.userDetails?.currentCredits;

  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      {loader && <Loader />}
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.userName}>
              {userData?.userDetails?.userName},
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("HistoryScreen")}
            style={styles.taskTrayContainer}
          >
            <TaskTray />
            <Text style={styles.taskTrayText}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          {/* Left side container */}
          <View style={styles.leftContainer}>
            <View>
              <Text style={styles.bottomText}>Total</Text>
              <Text style={styles.bottomText1}>Processed Images</Text>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.iconContainer}>
                <TwoBall />
              </View>
              <View style={{ width: "60%" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.rowText}
                >
                  {userData?.processedCount}
                </Text>
              </View>
            </View>
          </View>

          {/* Right side container */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("BillingScreen", { userData: userData })
            }
            style={styles.rightContainer}
          >
            <Text style={styles.bottomText}>Current Limit</Text>
            <Text style={styles.planText}>
              <Text style={styles.boldText}>
                {userData?.userDetails?.totalCredits} images
              </Text>{" "}
              {/* / per month */}
            </Text>
            <View style={{ ...styles.rowContainer }}>
              <View
                style={{
                  ...styles.statusContainer,
                  borderColor: isCurrentCountPresent ? "#FF000080" : "#8BED0F",
                }}
              >
                <View
                  style={{
                    ...styles.dot,
                    backgroundColor: isCurrentCountPresent
                      ? "#FF000080"
                      : "#8BED0F",
                  }}
                />
                <Text
                  style={{
                    ...styles.statusText,
                    color: isCurrentCountPresent ? "#FF000090" : "#69BB01",
                  }}
                >
                  {isCurrentCountPresent
                    ? "Low Credits"
                    : userData?.userDetails?.currentCredits === 0
                    ? "Inactive"
                    : "Active"}
                </Text>
              </View>
              <View style={{ width: isCurrentCountPresent ? "30%" : "50%" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.rowText}
                >
                  {userData?.userDetails?.currentCredits}
                </Text>
              </View>
            </View>
            <View style={styles.sliderContainer}>
              <View
                style={{
                  ...styles.fillBlue,
                  flex: !currentCredits ? 100 : currentCredits,
                }}
              />
              <View
                style={{
                  ...styles.fillGrey,
                  flex: !currentCredits ? 100 : totalCredits - currentCredits,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <View style={styles.historyRow}>
              <HistoryIcon />
              <Text style={styles.historyText}>Task Tray</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("TaskTrayScreen")}
              style={styles.viewAllContainer}
            >
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={historyData}
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
    backgroundColor: "#EAF7FF", // Background color of the screen
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  timeLeft: {
    color: "#2499DA",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  welcomeText: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#9D9D9D", // Text color
  },
  userName: {
    fontSize: moderateScale(28),
    color: "#2492FE", // Text color
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  taskTrayContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
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
    textAlign: "right",
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
    height: "60%",
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
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
  lastItemStyle: {
    marginBottom: 100,
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
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: -55,
  },
  totalPhotosContainer: {
    position: "relative",
  },
  overlayImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  totalPhotosText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -30 }],
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

export default Home;
