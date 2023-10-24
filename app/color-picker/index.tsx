import { View, StyleSheet, Dimensions } from "react-native";
import React, { useCallback } from "react";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const COLORS = [
  "red",
  "purple",
  "blue",
  "cyan",
  "green",
  "yellow",
  "orange",
  "black",
  "white",
];

const BACKGROUND_COLOR = "rgba(0,0,0,0.9)";

const ColorPicker = () => {
  const pickedColor = useSharedValue<string | number>(COLORS[0]);

  const rPickerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
    };
  });

  const handleColorChange = useCallback((color: string | number) => {
    "worklet";
    pickedColor.value = color;
  }, []);

  return (
    <>
      <View style={styles.topContainer}>
        <Animated.View style={[styles.circle, rPickerStyle]} />
      </View>
      <View style={styles.bottomContainer}>
        <ColorPickerTool
          colors={COLORS}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          onColorChange={handleColorChange}
        />
      </View>
    </>
  );
};

export default ColorPicker;

const { width } = Dimensions.get("window");

const CIRCLE_SIZE = width * 0.8;
const PICKER_WIDTH = width * 0.9;
const PICKER_CIRCLE_SIZE = 45;
const INTERNAL_CIRCLE_SIZE = PICKER_CIRCLE_SIZE / 2;

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: { height: 50, width: PICKER_WIDTH, borderRadius: 20 },
  picker: {
    position: "absolute",
    backgroundColor: "#fff",
    width: PICKER_CIRCLE_SIZE,
    height: PICKER_CIRCLE_SIZE,
    borderRadius: PICKER_CIRCLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  internalPicker: {
    width: INTERNAL_CIRCLE_SIZE,
    height: INTERNAL_CIRCLE_SIZE,
    borderRadius: INTERNAL_CIRCLE_SIZE / 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
  circle: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
});

interface ColorPickerToolProps extends LinearGradientProps {
  onColorChange?: (color: string | number) => void;
}

type ContextType = {
  translateX: number;
};

const ColorPickerTool = ({ onColorChange, ...props }: ColorPickerToolProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const adjustedTranslateX = useDerivedValue(() => {
    return Math.min(
      Math.max(translateX.value, 0),
      PICKER_WIDTH - PICKER_CIRCLE_SIZE
    );
  });

  const onEnd = useCallback(() => {
    "worklet";
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
  }, []);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.translateX = adjustedTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
    },
    onEnd,
  });

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (event) => {
        translateY.value = withSpring(-PICKER_CIRCLE_SIZE);
        scale.value = withSpring(1.2);
        translateX.value = withTiming(event.absoluteX - PICKER_CIRCLE_SIZE);
      },
      onEnd,
    });

  const rAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: adjustedTranslateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const inputRange = COLORS.map(
    (_, index) => (index / COLORS.length) * PICKER_WIDTH
  );

  const rInternalPickerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      inputRange,
      COLORS
    );

    onColorChange?.(backgroundColor);

    return {
      backgroundColor,
    };
  });

  return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View className="justify-center">
            <LinearGradient {...props} />
            <Animated.View style={[styles.picker, rAnimationStyle]}>
              <Animated.View
                style={[styles.internalPicker, rInternalPickerStyle]}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};
