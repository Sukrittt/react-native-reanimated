import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useCallback } from "react";
import { TapGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

const imageUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-yAa719vquPGX-XRdYjHUn9MXPnIg0MUp0Q&usqp=CAU";

const TapGesture = () => {
  const scale = useSharedValue(0);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: Math.max(scale.value, 0) }],
    };
  });

  const onDoubleTap = useCallback(() => {
    scale.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        scale.value = withDelay(500, withSpring(0));
      }
    });
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <TapGestureHandler
        maxDelayMs={250}
        numberOfTaps={2}
        onActivated={onDoubleTap}
      >
        <Animated.View>
          <ImageBackground
            source={{ uri: imageUrl }}
            resizeMode="contain"
            style={styles.image}
          >
            <View className="flex-1 justify-center items-center">
              <AnimatedImage
                source={require("../../public/heart.png")}
                style={[
                  styles.image,
                  {
                    height: 100,
                    width: 100,
                    shadowOffset: { width: 0, height: 20 },
                    shadowOpacity: 0.35,
                    shadowRadius: 35,
                  },
                  reanimatedStyle,
                ]}
                resizeMode="center"
              />
            </View>
          </ImageBackground>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export default TapGesture;

const AnimatedImage = Animated.createAnimatedComponent(Image);

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    height,
    width,
  },
  turtle: { fontSize: 70, textAlign: "center", marginTop: 30 },
});
