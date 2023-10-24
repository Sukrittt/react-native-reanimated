import { View, StyleSheet, StyleProp, ViewStyle, Text } from "react-native";
import React from "react";
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const RippleEffect = () => {
  return (
    <View style={styles.container}>
      <Ripple style={styles.ripple} onTap={() => console.log("tap")}>
        <Text style={styles.rippleText}>Tap</Text>
      </Ripple>
    </View>
  );
};

export default RippleEffect;

interface RippleProps {
  style?: StyleProp<ViewStyle>;
  onTap?: () => void;
  children: React.ReactNode;
}

const Ripple: React.FC<RippleProps> = ({ onTap, style, children }) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);

  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const animatedRef = useAnimatedRef<View>();

  const handleTapGesture =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (event) => {
        const layout = measure(animatedRef);
        height.value = layout.height;
        width.value = layout.width;

        centerX.value = event.x;
        centerY.value = event.y;

        scale.value = 0;
        scale.value = withTiming(1, { duration: 1000 });
      },
      onActive: () => {
        if (!onTap) return;

        runOnJS(onTap)();
      },
    });

  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);

    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;

    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      backgroundColor: "rgba(0,0,0,0.2)",
      opacity: 0.2,
      position: "absolute",
      top: 0,
      left: 0,
      transform: [{ scale: scale.value }, { translateX }, { translateY }],
    };
  });

  return (
    <View ref={animatedRef} style={style}>
      <TapGestureHandler onGestureEvent={handleTapGesture}>
        <Animated.View style={[style, { overflow: "hidden" }]}>
          <View>{children}</View>
          <Animated.View style={rStyle} />
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  ripple: {
    width: 200,
    height: 200,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  rippleText: { fontSize: 25 },
});
