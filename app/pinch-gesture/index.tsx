import { Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const imageUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdCgIyh2fHhuorPt2q9fh264w4BDydTYuyfA&usqp=CAU";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const { height, width } = Dimensions.get("window");

const PinchGesture = () => {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchGesterHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: (event) => {
        scale.value = event.scale;
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      },
      onEnd: () => {
        scale.value = withTiming(1);
      },
    });

  const rScaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });

  const rFocalPointAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
    };
  });

  return (
    <PinchGestureHandler onGestureEvent={pinchGesterHandler}>
      <Animated.View className="flex-1">
        <AnimatedImage
          style={rScaleAnimation}
          source={{ uri: imageUrl }}
          className="flex-1"
          resizeMode="cover"
        />
        <Animated.View style={[styles.focalPoint, rFocalPointAnimation]} />
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default PinchGesture;

const styles = StyleSheet.create({
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: "green",
  },
});
