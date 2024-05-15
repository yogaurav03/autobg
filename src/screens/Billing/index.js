import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  BillingIcon,
  BottomArrow,
  ClubIcon,
  CurrencyIcon,
  FilterIcon,
  LeftArrow,
  ProfileIcon,
  UpArrow,
} from "../../assets/icons";
import { image1, image2, image3 } from "../../assets/images";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useAppState } from "../../context/AppStateContext";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { moderateScale } from "../../utils/Scaling";

const Billing = ({ navigation, route }) => {
  const userData = route.params?.userData;
  const { state } = useAppState();
  const [refreshing, setRefreshing] = useState(false);
  const [billingData, setBillingData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [openBatchId, setOpenBatchId] = useState(null);

  const handleToggle = async (id) => {
    if (id === openBatchId) {
      // If clicking the same item, close it
      setOpenBatchId(null);
    } else {
      // Open the clicked item and fetch its image data
      if (state.token) {
        const response = await api.get(APIURLS.getImages(id), state.token);
        setImageData(response);
        setOpenBatchId(id); // Set the batchId of the opened item
      }
    }
  };

  const fetchBillingData = async () => {
    try {
      if (state.token) {
        const response = await api.get(APIURLS.usageHistory, state.token);
        setBillingData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBillingData();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => {
    const collectionCreatedAt = new Date(item?.date);
    const date = collectionCreatedAt.toISOString().split("T")[0];
    const time = collectionCreatedAt.toTimeString().split(" ")[0];
    const isOpen = item?.batchId === openBatchId;
    return (
      <TouchableWithoutFeedback
        onPress={() => handleToggle(item?.batchId)}
        style={styles.blueContainer}
      >
        {/* Individual list container */}
        <View style={styles.listContainer}>
          {/* Left side of list container */}
          <View style={styles.leftListContainer}>
            <Image source={image1} style={styles.listImage} />
            <Image source={image2} style={styles.listImage} />
            <View style={styles.totalPhotosContainer}>
              <Image source={image3} style={styles.overlayImage} />
            </View>
          </View>

          {/* Center of list container */}
          <View style={styles.centerListContainer}>
            <Text style={styles.nameText}>{item?.batchName}</Text>
            <Text style={styles.dateTimeText}>
              {time} {date}
            </Text>
          </View>

          {/* Right side of list container */}
          <View style={styles.rightContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceTxt}>
                {item.creditsDeducted > 0 ? "-" : ""}
                {item.creditsDeducted}
                <CurrencyIcon height={15} width={15} />
              </Text>
            </View>
            {!isOpen ? <BottomArrow /> : <UpArrow />}
          </View>
        </View>

        {isOpen && (
          <View style={styles.contentContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>
                {imageData?.processedImageCount}
              </Text>
              <Text style={styles.statusTextBilling}>Processed</Text>
              <Text style={styles.bottomText}>Images</Text>
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>{imageData?.failedImageCount}</Text>
              <Text style={{ ...styles.statusTextBilling, color: "#C11E04" }}>
                Failed
              </Text>
              <Text style={styles.bottomText}>Images</Text>
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>
                {imageData?.reportedImageCount}
              </Text>
              <Text style={{ ...styles.statusTextBilling, color: "#FFAE42" }}>
                Reported
              </Text>
              <Text style={styles.bottomText}>Images</Text>
            </View>
          </View>
        )}
      </TouchableWithoutFeedback>
    );
  };

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
          <View style={styles.taskTrayContainer}>
            <ProfileIcon />
          </View>
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.creditContainer}>
            <ClubIcon height={25} width={25} />
            <View style={styles.subContainer}>
              <Text style={styles.bottomText}>Current Plan</Text>
              <Text style={styles.planText}>
                <Text style={styles.boldText}>
                  {userData?.userDetails?.totalCredits} credits
                </Text>{" "}
                / per month
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.creditContainer}>
            <CurrencyIcon height={30} width={30} />
            <View style={styles.subContainer}>
              <Text style={styles.creditText}>Credit</Text>
              <Text style={styles.balText}>Balance</Text>
            </View>
          </View>
          <View style={{ marginTop: Platform.OS === "ios" ? -2 : -6 }}>
            <Text style={styles.balanceText}>
              {userData?.userDetails?.currentCredits}
            </Text>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <View style={styles.historyRow}>
              <BillingIcon />
              <Text style={styles.historyText}>Billing</Text>
            </View>
            <View style={styles.viewAllContainer}>
              <FilterIcon />
              <Text style={styles.viewAllText}>Filter</Text>
            </View>
          </View>
          <FlatList
            data={billingData}
            renderItem={renderItem}
            keyExtractor={(item) => item?.batchId}
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
  container: {
    flex: 1,
    padding: Platform.OS === "android" ? 10 : 20,
    backgroundColor: "#EAF7FF", // Background color of the screen
    paddingTop: Platform.OS === "android" ? 15 : 0,
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
    height: 60,
  },
  creditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  subContainer: {
    marginLeft: 10,
  },
  creditText: {
    color: "#33A3FF",
    fontWeight: "500",
    fontSize: moderateScale(12),
  },
  balText: {
    color: "#7D7D7D",
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },
  balanceText: {
    color: "#2499DA",
    fontWeight: "bold",
    fontSize: moderateScale(34),
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
  },
  taskTrayContainer: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
    flexDirection: "row",
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
    elevation: 5,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  bottomText: {
    fontSize: moderateScale(12),
    color: "#9D9D9D",
  },
  bottomText1: {
    fontSize: moderateScale(16),
    color: "#7D7D7D",
    fontWeight: "bold",
  },
  priceContainer: {
    marginRight: 10,
  },
  priceTxt: {
    color: "#7D7D7D",
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  rowContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    color: "#E1E1E1",
    fontWeight: "500",
  },
  statusTextBilling: {
    color: "#00701A",
    fontWeight: "bold",
    fontSize: moderateScale(10),
  },
  verticalLine: {
    height: "100%",
    width: 2,
    backgroundColor: "#2c3e5040", // Dark Grey color
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  planText: {
    fontSize: moderateScale(12),
    color: "#7D7D7D",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: moderateScale(14),
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
    marginBottom: 7,
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
    height: "80%",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2499DA",
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: moderateScale(14),
    marginLeft: 10,
  },
  blueContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
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
    width: 60,
    height: 50,
    borderRadius: 10,
    marginRight: -45,
  },
  totalPhotosContainer: {
    position: "relative",
  },
  overlayImage: {
    width: 60,
    height: 50,
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

export default Billing;
