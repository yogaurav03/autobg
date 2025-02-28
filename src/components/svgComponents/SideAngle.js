// import React from "react";
// import { Dimensions, Platform } from "react-native";
// import Svg, { Path, Rect, Text } from "react-native-svg";

// const SideAngle = ({ fill = "#17FF2D" }) => {
//   const { width, height } = Dimensions.get("screen");
//   const svgWidth =
//     Platform.OS === "ios"
//       ? width > 850
//         ? 0
//         : 0
//       : width > 1040
//       ? 60
//       : width > 900
//       ? 50
//       : width > 880
//       ? 35
//       : width > 860
//       ? 0
//       : width > 799
//       ? 80
//       : width > 810
//       ? 48
//       : 0;
//   return (
//     <Svg
//       width={width - svgWidth}
//       height={height * 1.85}
//       viewBox="0 0 932 78"
//       fill="none"
//     >
//       <Path
//         d="M37.6009 2H0V78H932V2H888.884V28.5H37.6009V2Z"
//         fillOpacity={0.4}
//         fill="#00BDFF"
//       />
//       <Path d="M0 2H37.5V28.5H889V2.5H932" stroke={fill} strokeWidth="4" />
//       <Rect
//         x="50%"
//         y="15"
//         width="200"
//         height="25"
//         fill={fill}
//         rx="15" // Rounded corners
//         transform="translate(-100, 0)" // Center the rectangle
//       />
//       <Text
//         x="50%"
//         y="32"
//         textAnchor="middle"
//         fontSize="14"
//         fill="#FFFFFF"
//         fontWeight="bold"
//       >
//         Match the line with tiers
//       </Text>
//     </Svg>
//   );
// };

// export default SideAngle;

import { View, Text, StyleSheet } from "react-native";
import React from "react";

const SideAngle = ({ fill = "#17FF2D" }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={{ ...styles.leftRectangle, borderColor: fill }} />
        <View
          style={{
            paddingVertical: 2,
            borderRadius: 20,
            zIndex: 2,
            backgroundColor: fill,
            alignItems: "center",
            justifyContent: "center",
            bottom: 8,
          }}
        >
          <Text style={{ ...styles.centerText }}>Match the line with tire</Text>
        </View>
        <View style={{ ...styles.rightRectangle, borderColor: fill }} />
      </View>
      <View style={{ ...styles.bottomRectangle, borderColor: fill }} />
      <View style={{ ...styles.bottomRectangle1 }} />
      <View style={{ ...styles.bottomRectangle2 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
  },
  leftRectangle: {
    width: "5%",
    height: 40,
    backgroundColor: "#00BFFF80",
    borderTopWidth: 4,
    borderRightWidth: 4,
    marginBottom: 16,
    zIndex: 1,
  },
  rightRectangle: {
    width: "5%",
    height: 40,
    backgroundColor: "#00BFFF80",
    borderTopWidth: 4,
    borderLeftWidth: 4,
    marginBottom: 16,
    zIndex: 1,
  },
  bottomRectangle: {
    position: "absolute",
    bottom: 0,
    width: "90%",
    height: 20,
    backgroundColor: "#00BFFF80",
    borderTopWidth: 4,
    zIndex: -1,
  },
  bottomRectangle1: {
    position: "absolute",
    bottom: 0,
    width: "5%",
    height: 16,
    backgroundColor: "#00BFFF80",
    left: 0,
  },
  bottomRectangle2: {
    position: "absolute",
    bottom: 0,
    width: "5%",
    height: 16,
    backgroundColor: "#00BFFF80",
    right: 0,
  },
  centerText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default SideAngle;
