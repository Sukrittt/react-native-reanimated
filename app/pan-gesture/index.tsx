import { View } from "react-native";
import React from "react";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

type ContextType = {
  translateX: number;
  translateY: number;
};

const About = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const reAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: (event) => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);

      if (distance > 350 / 2 + 100 / 2) return;

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View className="h-[350] w-[350] items-center justify-center rounded-full border-2 border-sky-500">
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View
            className="h-[100] w-[100] bg-blue-700 rounded-2xl"
            style={reAnimatedStyle}
          />
        </PanGestureHandler>
      </View>
    </View>
  );
};

export default About;
