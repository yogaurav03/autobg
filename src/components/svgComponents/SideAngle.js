import React from "react";
import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const SideAngle = ({ fill = "#17FF2D" }) => {
  const { width } = Dimensions.get("screen");
  return (
    <Svg width={width} height="74" viewBox="0 0 938 74" fill="none">
      <Path
        d="M40.6009 3H3V79H935V3H891.884V29.5H40.6009V3Z"
        fill="#27AAE1"
        stroke={fill}
        fillOpacity={0.4}
        strokeWidth={6}
      />
    </Svg>
  );
};

export default SideAngle;
