import React from "react";
import { Dimensions } from "react-native";
import Svg, { Circle, Path, Rect, Line, Polygon, G } from "react-native-svg";

const SteeringMeter = () => {
  const { width } = Dimensions.get("screen");
  return (
    <Svg viewBox="0 0 845.89 845.89" height="300" width={width}>
      <G>
        <Circle
          cx="422.94"
          cy="422.94"
          r="420.94"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Path
          d="M793.07,422.94c0,204.42-165.71,370.13-370.13,370.13S52.82,627.36,52.82,422.94c0-18.29,1.33-36.26,3.89-53.84C82.77,190.21,236.81,52.82,422.94,52.82c204.42,0,370.13,165.71,370.13,370.13Z"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="2"
        />
        <Circle
          cx="234.32"
          cy="272.58"
          r="107.28"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Circle
          cx="615.45"
          cy="272.58"
          r="107.28"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Rect
          x="390.68"
          y="177.01"
          width="78.24"
          height="185.76"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Line
          x1="2"
          y1="236.18"
          x2="133.86"
          y2="116.97"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Line
          x1="842.89"
          y1="232.45"
          x2="708.03"
          y2="113.23"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Polygon
          points="56.84 488.2 108.24 513.16 137.15 537.74 707.76 533.94 737.53 491.39 792.06 472.06 791.5 415.99 707.76 386.19 137.15 379.87 54.01 418.26 56.84 488.2"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Circle
          cx="234.32"
          cy="272.58"
          r="12.76"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Circle
          cx="615.45"
          cy="272.58"
          r="12.76"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Line
          x1="602.69"
          y1="272.58"
          x2="530.14"
          y2="259.83"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Line
          x1="220.19"
          y1="271.41"
          x2="165.36"
          y2="259.67"
          stroke="#6bcce0"
          strokeWidth="4"
        />
      </G>
    </Svg>
  );
};

export default SteeringMeter;
