import React from "react";
import { Dimensions } from "react-native";
import Svg, { Path, G } from "react-native-svg";

const RearSide = ({ fill = "#17FF2D" }) => {
  const { width } = Dimensions.get("screen");
  return (
    <Svg width={width} height="436" viewBox="0 0 850 436" fill="none">
      <G transform="scale(-1, 1) translate(-850, 0)">
        <Path
          d="M166.5 3H3V433H849L166.5 289.501V3Z"
          fill="#27AAE1"
          stroke={fill}
          fillOpacity={0.4}
          strokeWidth={6}
        />
      </G>
    </Svg>
  );
};

export default RearSide;
