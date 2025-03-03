import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  FlatList,
  StatusBar,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { image1, image2, image3 } from "../../assets/images";
import { FilterIcon, LeftArrow, RightArrow } from "../../assets/icons";
import { useAppState } from "../../context/AppStateContext";
import api from "../../utils/Api";
import { APIURLS } from "../../utils/ApiUrl";
// import DatePicker from "react-native-date-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import { moderateScale } from "../../utils/Scaling";
import moment from "moment";
import DateCard from "../../components/DataCard";
import Loader from "../../components/Loader";

const History = ({ navigation }) => {
  const { state } = useAppState();
  const [refreshing, setRefreshing] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [loader, setLoader] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const fetchHistoryData = async () => {
    try {
      setLoader(true);
      if (state.token) {
        const response = await api.get(APIURLS.getHistory, state.token);
        setHistoryData(response.data);
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
    fetchHistoryData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistoryData();
    setRefreshing(false);
  }, []);

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
    const filteredData = historyData.filter((item) => {
      // Parse the date from your item, assuming it's in collectionData.collectionCreatedAt
      const itemDate = new Date(item.collectionData.collectionCreatedAt);

      // Check if the item's date falls within the selected range
      return (
        itemDate >= startOfDaySelectedStartDate &&
        itemDate <= startOfDaySelectedEndDate
      );
    });

    // Update your state with the filtered data
    setFilterData(filteredData); // Or use a separate state variable if you want to preserve the original data
  };

  const renderItem = ({ item }) => {
    const collectionCreatedAt = new Date(
      item.collectionData?.collectionCreatedAt
    );
    const date = collectionCreatedAt.toISOString().split("T")[0];
    const time = collectionCreatedAt.toTimeString().split(" ")[0];
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProcessTrayScreen", {
            historyData: item,
            screenName: "History",
          })
        }
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
          <View style={{ marginRight: 10 }}>
            <RightArrow />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleConfirmStartDate = (date) => {
    setStartDatePickerVisibility(false);
    setSelectedStartDate(date);
  };

  const handleConfirmEndDate = (date) => {
    setEndDatePickerVisibility(false);
    setSelectedEndDate(date);
  };

  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      {loader && <Loader />}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconStyle}
        >
          <LeftArrow />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.history}>History</Text>
        <Text style={styles.subTextHistory}>
          All processed images are listed below.
        </Text>
        <View style={styles.historyContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={fetchHistoryData}
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
          {filterData.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Data</Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filterData}
              renderItem={renderItem}
              keyExtractor={(item) => item?.collectionData?.collectionId}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#87B2CA",
    marginLeft: 10,
    fontSize: moderateScale(12),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  row: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    borderColor: "grey",
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
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
  history: {
    fontSize: moderateScale(28),
    color: "#2492FE",
    fontWeight: "bold",
    textTransform: "capitalize",
    marginVertical: 10,
  },
  subTextHistory: {
    fontSize: moderateScale(12),
    fontWeight: "500",
    color: "#B3B3B3",
  },
  historyContainer: {
    backgroundColor: "#C7EAFF",
    height: "100%",
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 50,
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
    padding: 8,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 5,
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

export default History;
