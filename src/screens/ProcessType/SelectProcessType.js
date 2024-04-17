import {
  SafeAreaView,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
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
  const SubContainer = ({ title, subTitle, id }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("FolderNameScreen", {
            id: id,
          })
        }
        style={styles.subContainer}
      >
        <View>
          <Text style={styles.titleTxt}>{title}</Text>
          <Text style={styles.subTitleTxt}>{subTitle}</Text>
        </View>
        {subTitle === "Saved Template" ? (
          <SavedTemplateIcon />
        ) : subTitle === "Car Studio" ? (
          <CarStudioIcon />
        ) : (
          <TransparentImageIcon />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
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
            <HelpIcon />
          </View>
        </View>
        <SubContainer title="Generate using" subTitle="Saved Template" id={1} />
        <SubContainer title="Generate using" subTitle="Car Studio" id={2} />
        <SubContainer
          title="Generate using"
          subTitle="Transparent Images "
          id={3}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "android" ? 10 : 20,
    backgroundColor: "#EAF7FF", // Background color of the screen
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
