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
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
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
import { useAppState } from "../../context/AppStateContext";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
import { moderateScale } from "../../utils/Scaling";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import moment from "moment";
import DateCard from "../../components/DataCard";
import Loader from "../../components/Loader";

const Billing = ({ navigation, route }) => {
  const userData = route.params?.userData;
  const { state } = useAppState();
  const [refreshing, setRefreshing] = useState(false);
  const [billingData, setBillingData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [openBatchId, setOpenBatchId] = useState(null);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [loader, setLoader] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const [filterData, setFilterData] = useState([]);

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
      setLoader(true);
      if (state.token) {
        const response = await api.get(APIURLS.usageHistory, state.token);
        setBillingData(response.data);
        setFilterData(response.data);
        setFilterModalVisible(false);
        setSelectedStartDate(new Date());
        setSelectedEndDate(new Date());
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
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
      <TouchableOpacity
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
      </TouchableOpacity>
    );
  };

  const applyDateFilter = () => {
    // Close the modal first
    setFilterModalVisible(false);

    // Assuming historyData is already populated and each item has a date field
    // Convert selectedStartDate and selectedEndDate to the start of their respective days for comparison
    const startOfDaySelectedStartDate = new Date(
      selectedStartDate.setHours(0, 0, 0, 0)
    );
    const startOfDaySelectedEndDate = new Date(
      selectedEndDate.setHours(23, 59, 59, 999)
    );

    // Filter the history data based on the selected date range
    const filteredData = billingData.filter((item) => {
      const collectionCreatedAt = new Date(item?.date);

      // Parse the date from your item, assuming it's in collectionData.collectionCreatedAt
      const itemDate = new Date(collectionCreatedAt);

      // Check if the item's date falls within the selected range
      return (
        itemDate >= startOfDaySelectedStartDate &&
        itemDate <= startOfDaySelectedEndDate
      );
    });

    // Update your state with the filtered data
    setFilterData(filteredData); // Or use a separate state variable if you want to preserve the original data
  };

  const handleConfirmStartDate = (date) => {
    setStartDatePickerVisibility(false);
    setSelectedStartDate(date);
  };

  const handleConfirmEndDate = (date) => {
    setEndDatePickerVisibility(false);
    setSelectedEndDate(date);
  };

  const isCurrentCountPresent = userData?.userDetails?.currentCredits < 10;

  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      {loader && <Loader />}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconStyle}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProfileScreen", {
                isBackPresent: true,
              })
            }
            style={styles.taskTrayContainer}
          >
            <ProfileIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.creditContainer}>
            <ClubIcon height={25} width={25} />
            <View style={styles.subContainer}>
              <Text style={styles.bottomText}>Current Limit</Text>
              <Text style={styles.planText}>
                <Text style={styles.boldText}>
                  {userData?.userDetails?.totalCredits}{" "}
                  {userData?.userDetails?.totalCredits === 1
                    ? "image"
                    : "images"}
                </Text>{" "}
                {/* / per month */}
              </Text>
            </View>
          </View>
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
        </View>

        <View style={styles.headerContainer}>
          <View style={{ ...styles.creditContainer, width: "40%" }}>
            <CurrencyIcon height={30} width={30} />
            <View style={styles.subContainer}>
              <Text style={styles.creditText}>Image</Text>
              <Text style={styles.balText}>Balance</Text>
            </View>
          </View>
          <View
            style={{
              marginTop: Platform.OS === "ios" ? -2 : -6,
              width: "60%",
              alignItems: "flex-end",
            }}
          >
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={fetchBillingData}
                style={{
                  ...styles.viewAllContainer,
                  backgroundColor: "#939598",
                }}
              >
                <Text style={{ ...styles.viewAllText, marginLeft: 0 }}>
                  Clear Filter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(true)}
                style={styles.viewAllContainer}
              >
                <FilterIcon />
                <Text style={styles.viewAllText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
          {filterData.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Data</Text>
            </View>
          ) : (
            <FlatList
              data={filterData}
              renderItem={renderItem}
              keyExtractor={(item) => item?.batchId}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
      <Modal
        isVisible={isFilterModalVisible}
        onBackdropPress={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View
            style={{
              ...styles.row,
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 20,
            }}
          >
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Icon name="event" size={moderateScale(24)} color="#ACACAC" />
              </View>
              <View>
                <Text style={styles.dateTitle}>Select Dates</Text>
                <Text style={styles.dateDecs}>
                  Select dates for filtering billing data{" "}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={{ fontSize: moderateScale(22), color: "#BBBBBB" }}>
                X
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Text>Select Start Date:</Text>
          <TouchableOpacity onPress={() => setStartDatePickerVisibility(true)}>
            <Text style={{ color: "#2499DA", fontSize: moderateScale(18) }}>
              {moment(selectedStartDate).format("MMMM Do YYYY")}
            </Text>
          </TouchableOpacity> */}
          <DateCard
            onPress={() => setStartDatePickerVisibility(true)}
            title="Start Date"
            date={moment(selectedStartDate).format("MMMM Do YYYY")}
          />

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmStartDate}
            onCancel={() => setStartDatePickerVisibility(false)}
          />
          {/* <Text>Select End Date:</Text>
          <TouchableOpacity onPress={() => setEndDatePickerVisibility(true)}>
            <Text style={{ color: "#2499DA", fontSize: moderateScale(18) }}>
              {moment(selectedEndDate).format("MMMM Do YYYY")}
            </Text>
          </TouchableOpacity> */}
          <DateCard
            onPress={() => setEndDatePickerVisibility(true)}
            title="End Date"
            date={moment(selectedEndDate).format("MMMM Do YYYY")}
          />
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmEndDate}
            onCancel={() => setEndDatePickerVisibility(false)}
          />
          <View>
            <TouchableOpacity style={styles.button} onPress={applyDateFilter}>
              <FilterIcon width={20} height={20} />
              <Text style={styles.buttonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  creditContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
  },
  subContainer: {
    marginLeft: 10,
    width: "70%",
  },
  row: { flexDirection: "row", alignItems: "center" },
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
    justifyContent: "center",
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
  dateTitle: {
    fontSize: moderateScale(28),
    color: "#32A1FC",
    fontWeight: "700",
  },
  dateDecs: {
    fontSize: moderateScale(10),
    color: "#B3B3B3",
    fontWeight: "300",
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
    width: "30%",
    justifyContent: "center",
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
    paddingBottom: 70,
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
    padding: 8,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: moderateScale(12),
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
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 20,
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2499DA",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: moderateScale(14),
    textAlign: "center",
    fontWeight: "600",
    marginLeft: 10,
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: moderateScale(16),
    color: "#8A93A4",
    fontWeight: "700",
  },
});

export default Billing;
