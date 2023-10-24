import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

const Layout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "React Reanimated",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/pan-gesture")}>
              <Text>Pan Gesture</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="pan-gesture/index"
        options={{
          headerTitle: "Pan Gesture",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/interpolate")}>
              <Text>Interpolate</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="interpolate/index"
        options={{
          headerTitle: "Interpolate",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/interpolate-colors")}
            >
              <Text>Interpolate Colors</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="interpolate-colors/index"
        options={{
          headerTitle: "Interpolate Colors",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/pinch-gesture")}>
              <Text>Pinch Gesture</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="pinch-gesture/index"
        options={{
          headerTitle: "Pinch Gesture",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/tap-gesture")}>
              <Text>Tap Gesture</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="tap-gesture/index"
        options={{
          headerTitle: "Tap Gesture",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/color-picker")}>
              <Text>Color Picker</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="color-picker/index"
        options={{
          headerTitle: "Color Picker",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/circular-progress")}>
              <Text>Circular Progress</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="circular-progress/index"
        options={{
          headerTitle: "Circular Progress",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/swipe-delete")}>
              <Text>Swipe Delete</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="swipe-delete/index"
        options={{
          headerTitle: "Swipe Delete",
          // headerRight: () => (
          //   <TouchableOpacity onPress={() => router.push("/swipe-delete")}>
          //     <Text>Swipe Delete</Text>
          //   </TouchableOpacity>
          // ),
        }}
      />
    </Stack>
  );
};

export default Layout;
