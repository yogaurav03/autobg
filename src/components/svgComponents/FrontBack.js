// // FrontBack.js
// import React from "react";
// import { Dimensions, PixelRatio, Platform } from "react-native";
// import Svg, { Path, Mask, Text, Rect } from "react-native-svg";

// const FrontBack = ({ fill = "#17FF2D" }) => {
//   const { width, height } = Dimensions.get("screen");

//   const dpi = PixelRatio.get() * 156;

//   const widthInInches = width / dpi;
//   const heightInInches = height / dpi;

//   // Calculate the diagonal screen size in inches using the Pythagorean theorem
//   const screenDiagonalInInches =
//     Math.sqrt(Math.pow(widthInInches, 2) + Math.pow(heightInInches, 2)) *
//     PixelRatio.get();

//   const deviceInches = screenDiagonalInInches;

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
//       ? 50
//       : 0;

//   return (
//     <Svg
//       width={width - svgWidth}
//       height={height * 1.75}
//       viewBox="0 0 932 74"
//       fill="none"
//     >
//       <Mask id="path-1-inside-1_698_423" fill="white">
//         <Path
//           fillRule="evenodd"
//           clipRule="evenodd"
//           d="M235 0H-11V103H943V0H694V51H235V0Z"
//         />
//       </Mask>
//       <Path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M235 0H-11V103H943V0H694V51H235V0Z"
//         fillOpacity={0.4}
//         fill="#27AAE1"
//       />
//       <Path
//         d="M-11 0V-5H-16V0H-11ZM235 0H240V-5H235V0ZM-11 103H-16V108H-11V103ZM943 103V108H948V103H943ZM943 0H948V-5H943V0ZM694 0V-5H689V0H694ZM694 51V56H699V51H694ZM235 51H230V56H235V51ZM-11 5H235V-5H-11V5ZM-6 103V0H-16V103H-6ZM943 98H-11V108H943V98ZM938 0V103H948V0H938ZM694 5H943V-5H694V5ZM689 0V51H699V0H689ZM694 46H235V56H694V46ZM240 51V0H230V51H240Z"
//         fill={fill}
//         mask="url(#path-1-inside-1_698_423)"
//       />
//       <Rect
//         x="50%"
//         y="40"
//         width="200"
//         height="25"
//         fill={fill}
//         rx="15" // Rounded corners
//         transform="translate(-100, 0)" // Center the rectangle
//       />
//       <Text
//         x="50%"
//         y="57"
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

// export default FrontBack;

import { View, Text, StyleSheet } from "react-native";
import React from "react";

const FrontBack = ({ fill = "#17FF2D" }) => {
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
          <Text style={{ ...styles.centerText }}>Match the line with tyre</Text>
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
    width: "25%",
    height: 50,
    backgroundColor: "#00BFFF80",
    borderTopWidth: 4,
    borderRightWidth: 4,
    marginBottom: 16,
    zIndex: 1,
  },
  rightRectangle: {
    width: "25%",
    height: 50,
    backgroundColor: "#00BFFF80",
    borderTopWidth: 4,
    borderLeftWidth: 4,
    marginBottom: 16,
    zIndex: 1,
  },
  bottomRectangle: {
    position: "absolute",
    bottom: 0,
    width: "50%",
    height: 20,
    backgroundColor: "#00BFFF80",
    borderTopWidth: 4,
    zIndex: -1,
  },
  bottomRectangle1: {
    position: "absolute",
    bottom: 0,
    width: "25%",
    height: 16,
    backgroundColor: "#00BFFF80",
    left: 0,
  },
  bottomRectangle2: {
    position: "absolute",
    bottom: 0,
    width: "25%",
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

export default FrontBack;
