// import React from "react";
// import { Dimensions, Platform } from "react-native";
// import Svg, { Path } from "react-native-svg";

// const BackSide = ({ fill = "#17FF2D" }) => {
//   const { width, height } = Dimensions.get("screen");

//   const strokeD =
//     width > 900 ? "M163 0V283.511L1200 440" : "M163 0V283.511L940 440";

//   const pathD =
//     width > 900
//       ? "M163.5 0H0V440H1200L163.5 284.5V0Z"
//       : "M163.5 0H0V440H940L163.5 284.5V0Z";

//   return (
//     <Svg width={width} height={height} viewBox="0 0 940 412" fill="none">
//       <Path d={pathD} fill="#00BDFF" fillOpacity={0.4} />
//       <Path d={strokeD} stroke={fill} strokeWidth={4} />
//     </Svg>
//   );
// };

// export default BackSide;

import React from "react";
import { Dimensions, Platform, PixelRatio } from "react-native";
import Svg, { G, Path, Rect, Text } from "react-native-svg";

const BackSide = ({ fill = "#17FF2D" }) => {
  const { width, height } = Dimensions.get("screen");
  const pixelDensity = PixelRatio.get();
  const dpi = PixelRatio.get() * 156;

  const widthInInches = width / dpi;
  const heightInInches = height / dpi;

  // Calculate the diagonal screen size in inches using the Pythagorean theorem
  const screenDiagonalInInches =
    Math.sqrt(Math.pow(widthInInches, 2) + Math.pow(heightInInches, 2)) *
    PixelRatio.get();

  const deviceInches = screenDiagonalInInches;

  const viewBoxPlatform =
    Platform.OS === "ios"
      ? width > 850
        ? 600
        : 600
      : width < 740
      ? 785
      : width > 865
      ? 660
      : width > 855
      ? 700
      : width > 799 && width < 810
      ? 625
      : 645;

  const viewBox = `0 0 ${
    Platform.OS === "ios" ? 1300 : 1400
  } ${viewBoxPlatform}`;

  const pathD =
    width < 740
      ? "M219.241 0H0V763H913L219.241 348V0Z"
      : width > 860
      ? "M219.241 0H0V723H813L219.241 348V0Z"
      : "M219.241 0H0V623H713L219.241 348V0Z";
  const strokeD =
    width < 740
      ? "M216 1V349.5L911.5 762.5"
      : width > 860
      ? "M216 1V349.5L811.5 722.5"
      : "M216 1V349.5L711.5 622.5";

  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none">
      <Path d={pathD} fill="#00BDFF" fillOpacity={0.4} />
      <Path d={strokeD} stroke={fill} strokeWidth="5" />
      <G transform={`translate(0, 349) rotate(0)`}>
        <Rect
          x={0}
          y={
            deviceInches > 6.4 ||
            deviceInches > 6.1 ||
            deviceInches > 6.6 ||
            deviceInches > 6.7
              ? 120
              : deviceInches > 6
              ? 100
              : deviceInches > 5.6 && deviceInches < 5.7
              ? 100
              : deviceInches >= 5
              ? 110
              : 120
          }
          width="200"
          height="25"
          rx="12.5"
          transform={`rotate(${
            width > 900 ? 32 : width > 860 ? 32 : 29
          } 298.818 576)`}
          fill={fill}
        />
        <Text
          x={100}
          y={
            deviceInches > 6.4 ||
            deviceInches > 6.1 ||
            deviceInches > 6.6 ||
            deviceInches > 6.7
              ? 136
              : deviceInches > 6
              ? 116
              : deviceInches > 5.6 && deviceInches < 5.7
              ? 116
              : deviceInches >= 5
              ? 126
              : 136
          }
          textAnchor="middle"
          fontSize="14"
          fill="#FFFFFF"
          fontWeight="bold"
          transform={`rotate(${
            width > 900 ? 32 : width > 860 ? 32 : 29
          } 298.818 576)`}
        >
          Match the line with tyre
        </Text>
      </G>
    </Svg>
  );
};

export default BackSide;
