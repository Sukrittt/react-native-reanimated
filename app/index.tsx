import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";

const Home = () => {
  const progress = useSharedValue(1);
  const scale = useSharedValue(2);

  const handleRotation = (progress: Animated.SharedValue<number>) => {
    "worklet";
    return `${progress.value * 2 * Math.PI}rad`;
  };

  const reAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      borderRadius: (progress.value * 100) / 2,
      transform: [{ scale: scale.value }, { rotate: handleRotation(progress) }],
    };
  }, []);

  useEffect(() => {
    progress.value = withRepeat(withSpring(0.5), -1, true);
    scale.value = withRepeat(withSpring(1), -1, true);
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View
        style={[
          { height: 100, width: 100, backgroundColor: "blue" },
          reAnimatedStyle,
        ]}
      />
    </View>
  );
};

export default Home;
