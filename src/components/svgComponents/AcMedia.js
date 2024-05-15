import React from "react";
import { Dimensions } from "react-native";
import { Svg, Rect, Circle, Line, G } from "react-native-svg";

const AcMedia = () => {
  const { width } = Dimensions.get("screen");
  return (
    <Svg viewBox="0 0 841.89 424.23" height="424" width={width}>
      <G>
        <Rect
          x="222.14"
          y="2"
          width="416.74"
          height="228.85"
          rx="20.98"
          ry="20.98"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Rect
          x="227.52"
          y="248.83"
          width="193.42"
          height="111.47"
          rx="20.98"
          ry="20.98"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Rect
          x="233.79"
          y="13.65"
          width="393.57"
          height="205.56"
          rx="20.98"
          ry="20.98"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="2"
        />
        <Rect
          x="444.95"
          y="248.83"
          width="193.42"
          height="111.47"
          rx="20.98"
          ry="20.98"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Rect
          x="298.94"
          y="294.54"
          width="53.29"
          height="10.03"
          rx="5.01"
          ry="5.01"
          fill="#fff"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Rect
          x="519.64"
          y="294.04"
          width="53.29"
          height="10.03"
          rx="5.01"
          ry="5.01"
          fill="#fff"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Rect
          x="304.2"
          y="385.24"
          width="256.25"
          height="32.88"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Circle
          cx="612.98"
          cy="401.25"
          r="20.98"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        <Circle
          cx="254.76"
          cy="399.25"
          r="20.98"
          fill="none"
          stroke="#6bcce0"
          strokeWidth="4"
        />
        {[
          { x1: "227.52", y1: "273.56", x2: "420.94", y2: "273.56" },
          { x1: "227.52", y1: "286.56", x2: "420.94", y2: "286.56" },
          { x1: "227.52", y1: "299.56", x2: "298.94", y2: "299.56" },
          { x1: "227.52", y1: "311.56", x2: "420.94", y2: "311.56" },
          { x1: "227.52", y1: "322.56", x2: "420.94", y2: "322.56" },
          { x1: "226.52", y1: "334.56", x2: "419.94", y2: "334.56" },
          { x1: "227.52", y1: "346.56", x2: "420.94", y2: "346.56" },
          { x1: "227.52", y1: "262.56", x2: "420.94", y2: "262.56" },
          { x1: "444.95", y1: "273.56", x2: "638.38", y2: "273.56" },
          { x1: "444.95", y1: "286.56", x2: "638.38", y2: "286.56" },
          { x1: "444.95", y1: "299.56", x2: "519.64", y2: "299.56" },
          { x1: "444.95", y1: "311.56", x2: "638.38", y2: "311.56" },
          { x1: "444.95", y1: "322.56", x2: "638.38", y2: "322.56" },
          { x1: "443.95", y1: "334.56", x2: "637.38", y2: "334.56" },
          { x1: "444.95", y1: "346.56", x2: "638.38", y2: "346.56" },
          { x1: "444.95", y1: "262.56", x2: "638.38", y2: "262.56" },
          { x1: "349.53", y1: "299.06", x2: "420.94", y2: "299.06" },
          { x1: "572.93", y1: "299.56", x2: "638.88", y2: "299.56" },
        ].map((line, index) => (
          <Line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#6bcce0"
            strokeWidth="3"
            fill="#fff"
          />
        ))}
      </G>
    </Svg>
  );
};

export default AcMedia;
