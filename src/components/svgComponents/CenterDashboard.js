import React from "react";
import { Svg, Polyline, Line, G } from "react-native-svg";

const CenterDashboard = () => {
  return (
    <Svg viewBox="0 0 843.76 578.84" height="578.84" width="843.76">
      <G>
        <Polyline
          points=".63 266.82 98.62 252.96 672.57 252.96 740.39 252.96 843.5 266.82"
          fill="none"
          stroke="#6bcce0"
          strokeMiterlimit="10"
          strokeWidth="4"
        />
        <Polyline
          points="516.18 578.48 480.22 380.32 740.39 380.32 364.98 380.32 330.21 578.48"
          fill="none"
          stroke="#6bcce0"
          strokeMiterlimit="10"
          strokeWidth="4"
        />
        <Polyline
          points="364.88 252.96 364.88 380.32 97.53 380.32 .63 412.24"
          fill="none"
          stroke="#6bcce0"
          strokeMiterlimit="10"
          strokeWidth="4"
        />
        <Line
          x1="477.37"
          y1="252.96"
          x2="480.01"
          y2="380.32"
          stroke="#6bcce0"
          strokeWidth="4"
        />
      </G>
    </Svg>
  );
};

export default CenterDashboard;
