import { Dimensions, StyleSheet, Switch } from "react-native";
import React, { useState } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

type Theme = "light" | "dark";

const SWITCH_TRACK_COLOR = {
  true: "rgba(256,0,256,0.5)",
  false: "rgba(256,0,256,0.1)",
};

const COLORS = {
  dark: {
    background: "#1e1e1e",
    circle: "#252525",
    text: "#f8f8f8",
  },
  light: {
    background: "#f8f8f8",
    circle: "#fff",
    text: "#1e1e1e",
  },
};

const InterpolateColors = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const progress = useDerivedValue(() => {
    return theme === "dark" ? withTiming(1) : withTiming(0);
  });

  const reanimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.background, COLORS.dark.background]
    );

    return { backgroundColor };
  });

  const reanimatedCircleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.circle, COLORS.dark.circle]
    );

    return { backgroundColor };
  });

  const reanimatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.text, COLORS.dark.text]
    );

    return { color };
  });

  return (
    <Animated.View
      className="flex-1 items-center justify-center"
      style={reanimatedStyle}
    >
      <Animated.Text style={[styles.ThemeText, reanimatedTextStyle]}>
        Theme
      </Animated.Text>
      <Animated.View style={[styles.circle, reanimatedCircleStyle]}>
        <Switch
          value={theme === "dark"}
          onValueChange={(toggled) => setTheme(toggled ? "dark" : "light")}
          trackColor={SWITCH_TRACK_COLOR}
          thumbColor="violet"
        />
      </Animated.View>
    </Animated.View>
  );
};

export default InterpolateColors;

const SIZE = Dimensions.get("window").width * 0.7;

const styles = StyleSheet.create({
  circle: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZE / 2,
    backgroundColor: "white",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 6,
  },
  ThemeText: {
    fontSize: 70,
    fontWeight: "700",
    letterSpacing: 14,
    marginBottom: 35,
    textTransform: "uppercase",
  },
});
