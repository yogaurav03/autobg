import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { moderateScale } from "../utils/Scaling";

const DateCard = ({ title, date, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="event" size={moderateScale(24)} color="#4AA3DF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.dateText}>
          <Text style={styles.boldText}>{date}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#E1F2FF",
    borderRadius: 10,
    padding: moderateScale(15),
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  iconContainer: {
    marginRight: moderateScale(10),
  },
  textContainer: {
    flexDirection: "column",
  },
  label: {
    fontSize: moderateScale(14),
    color: "#9DA3AF",
  },
  dateText: {
    fontSize: moderateScale(18),
    color: "#2E2E2E",
  },
  boldText: {
    fontWeight: "bold",
    color: "#2E2E2E",
  },
});

export default DateCard;
