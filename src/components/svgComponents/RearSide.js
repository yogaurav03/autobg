// import React from "react";
// import { Dimensions, Platform } from "react-native";
// import Svg, { Path, G } from "react-native-svg";

// const RearSide = ({ fill = "#17FF2D" }) => {
//   const { width, height } = Dimensions.get("screen");
//   const viewBox = Platform.OS === "ios" ? "0 0 760 436" : "0 0 800 436";

//   const strokeD =
//     width > 850 ? "M163 0V283.511L1100 430" : "M163 0V283.511L910 430";

//   const pathD =
//     width > 850
//       ? "M163.5 0H0V430H1100L163.5 284.5V0Z"
//       : "M163.5 0H0V430H910L163.5 284.5V0Z";

//   return (
//     <Svg width={width} height={height * 1.02} viewBox={viewBox} fill="none">
//       <G transform="scale(-1, 1) translate(-850, 0)">
//         <Path d={pathD} fill="#00BDFF" fillOpacity={0.4} />
//         <Path d={strokeD} stroke={fill} strokeWidth={4} />
//       </G>
//     </Svg>
//   );
// };

// export default RearSide;

import React from "react";
import { Dimensions, Platform } from "react-native";
import Svg, { G, Path, Rect, Text } from "react-native-svg";

const RearSide = ({ fill = "#17FF2D" }) => {
  const { width, height } = Dimensions.get("screen");
  const viewBoxPlatform =
    Platform.OS === "ios"
      ? width > 850
        ? 540
        : 540
      : width > 880
      ? 610
      : width > 865
      ? 575
      : width > 855
      ? 605
      : 615;
  const viewBox = `0 0 213 ${viewBoxPlatform}`;

  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none">
      <Path
        d="M493.759 0H713V623H0L493.759 318V0Z"
        fillOpacity={0.4}
        fill="#00BDFF"
      />
      <Path d="M497 1V319.5L1.5 622.5" stroke={fill} strokeWidth="5" />
      <G transform={`translate(497, 319) rotate(0)`}>
        <Rect
          x={0}
          y={-50}
          width="200"
          height="25"
          fill={fill}
          rx="15" // Rounded corners
          transform="rotate(-31 207 478.318)"
        />
        <Text
          x={100}
          y={-33}
          textAnchor="middle"
          fontSize="14"
          fill="#FFFFFF"
          fontWeight="bold"
          transform="rotate(-31 207 478.318)"
        >
          Match the line with tyre
        </Text>
      </G>
    </Svg>
  );
};

export default RearSide;
