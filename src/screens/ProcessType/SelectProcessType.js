import {
  SafeAreaView,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from "react-native";
import React from "react";
import {
  CarStudioIcon,
  HelpIcon,
  LeftArrow,
  SavedTemplateIcon,
  TransparentImageIcon,
} from "../../assets/icons";
import { moderateScale } from "../../utils/Scaling";

const SelectProcessType = ({ navigation }) => {
  const onClickProcess = (id) => () => {
    if (id === 2) {
      // Alert.alert("Comming Soon", "Car Studio... inprogress...");
    } else {
      navigation.navigate("FolderNameScreen", {
        id: id,
      });
    }
  };
  const SubContainer = ({ title, subTitle, id, inprogress }) => {
    return (
      <TouchableOpacity
        onPress={onClickProcess(id)}
        style={{ ...styles.subContainer }}
        disabled={inprogress}
      >
        <View>
          <View>
            <Text style={styles.titleTxt}>{title}</Text>
            <Text style={styles.subTitleTxt}>{subTitle}</Text>
          </View>

          {inprogress && <Text style={styles.overlayText}>Coming Soon...</Text>}
        </View>
        {subTitle === "Saved Template" ? (
          <SavedTemplateIcon />
        ) : subTitle === "Car Studio" ? (
          <CarStudioIcon />
        ) : (
          <TransparentImageIcon />
        )}
        {inprogress && <View style={styles.overlay}></View>}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconStyle}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <View>
              <Text style={styles.selectTxt}>Select</Text>
              <Text style={styles.processTypeTxt}>Process Type</Text>
            </View>
            {/* <HelpIcon /> */}
          </View>
        </View>
        <SubContainer
          title="Generate using"
          subTitle="Saved Template"
          id={1}
          inprogress={false}
        />
        <SubContainer
          title="Generate using"
          subTitle="Transparent Images "
          id={3}
          inprogress={false}
        />
        {/* <SubContainer
          title="Generate using"
          subTitle="Car Studio"
          id={2}
          inprogress={true}
        /> */}
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
  backText: {
    color: "#004E8E",
    marginLeft: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectTxt: {
    color: "#9D9D9D",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  processTypeTxt: {
    color: "#2492FE",
    fontWeight: "bold",
    fontSize: moderateScale(24),
  },
  subContainer: {
    backgroundColor: "#0072CF30",
    padding: 10,
    borderRadius: 10,
    marginRight: -30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 30,
    height: "22%",
    marginVertical: 8,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill the entire TouchableOpacity
    backgroundColor: "0072CF30", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  overlayText: {
    color: "#1C6998",
    fontSize: moderateScale(16),
    fontWeight: "500",
    marginTop: 15,
  },
  titleTxt: {
    color: "#32A1FC",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  subTitleTxt: {
    color: "#1C6998",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
});

export default SelectProcessType;
