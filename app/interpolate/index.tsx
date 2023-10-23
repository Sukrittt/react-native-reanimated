import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const WORDS = ["I", "Love", "You", "Mehak💖"];

const Interpolate = () => {
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x;
  });

  return (
    <Animated.ScrollView
      horizontal
      className="flex-1"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      {WORDS.map((title, index) => (
        <PageView
          key={index}
          title={title}
          index={index}
          translateX={translateX}
        />
      ))}
    </Animated.ScrollView>
  );
};

export default Interpolate;

const { height, width } = Dimensions.get("window");
const SIZE = width * 0.7;

const PageView = ({
  title,
  index,
  translateX,
}: {
  title: String;
  index: number;
  translateX: Animated.SharedValue<number>;
}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const reanimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const borderRadius = interpolate(
      translateX.value,
      inputRange,
      [0, SIZE / 2, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      borderRadius,
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      translateX.value,
      inputRange,
      [height / 2, 0, -height / 2],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      translateX.value,
      inputRange,
      [-2, 1, -2],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <View
      style={{ height, width, backgroundColor: `rgba(0,0,256,0.${index + 2})` }}
      className="flex-1 justify-center items-center"
    >
      <Animated.View
        style={[styles.square, reanimatedStyle]}
        className="bg-[#80cdd1]"
      />
      <Animated.View style={[{ position: "absolute" }, rTextStyle]}>
        <Text className="text-white text-5xl uppercase font-extrabold py-4">
          {title}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  square: {
    height: SIZE,
    width: SIZE,
  },
});
