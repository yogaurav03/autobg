import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Svg, { G, Circle, Line, Text as SvgText } from "react-native-svg";
import { moderateScale } from "../utils/Scaling";

const Timer = ({ totalTime }) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const radius = 100; // radius of the circle
  const strokeWidth = 1.5;
  const lineCount = 90; // total number of lines to start with
  const textBackgroundRadius = 20; // radius of the background circle for the text

  // Calculate how many lines to show based on the time left
  const activeLineCount = Math.ceil((timeLeft / totalTime) * lineCount);

  const lines = [];
  for (let i = 0; i < lineCount; i++) {
    const rotation = (360 / lineCount) * i;
    const lineLength = 20;
    const x1 = radius - Math.sin((rotation * Math.PI) / 180) * radius;
    const y1 = radius - Math.cos((rotation * Math.PI) / 180) * radius;
    const x2 =
      radius - Math.sin((rotation * Math.PI) / 180) * (radius - lineLength);
    const y2 =
      radius - Math.cos((rotation * Math.PI) / 180) * (radius - lineLength);

    lines.push(
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={i < activeLineCount ? "#2499DA" : "#fff"} // Active lines are blue, inactive lines are grey
        strokeWidth={strokeWidth}
      />
    );
  }

  return (
    <View>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <G rotation="90" origin={`${radius}, ${radius}`}>
          {/* Background circle for text */}
          <Circle
            cx={radius}
            cy={radius}
            r={textBackgroundRadius}
            fill="#EEF9FF"
          />
          {/* White background for lines */}
          <Circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2} // Subtracting half the stroke width to ensure lines are on top of the background
            fill="white"
            stroke="none"
          />
          {lines}
          <View
            style={{
              top: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="clock" size={moderateScale(24)} color="#ACACAC" />
            <Text
              style={{
                color: "#2499DA",
                fontSize: moderateScale(30),
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              {`${Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")}:${(timeLeft % 60)
                .toString()
                .padStart(2, "0")}`}
            </Text>
          </View>
          <View
            style={{
              top: 20,
              left: 20,
              width: 160,
              height: 160,
              backgroundColor: "#EEF9FF",
              borderRadius: 100,
              zIndex: -1,
              position: "absolute",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 5,
            }}
          />

          {/* <SvgText
            x={radius}
            y={radius + 30} // Adjust the position accordingly
            textAnchor="middle"
            fontWeight="bold"
            fontSize="30"
            fill="#2499DA"
            rotation="90"
            origin={`${radius}, ${radius}`}>
            {`${Math.floor(timeLeft / 60)
              .toString()
              .padStart(2, '0')}:${(timeLeft % 60)
              .toString()
              .padStart(2, '0')}`}
          </SvgText> */}
        </G>
      </Svg>
    </View>
  );
};

export default Timer;
