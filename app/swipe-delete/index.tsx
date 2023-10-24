import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TITLES = [
  "Buy eggs 🥚 from the grocery store",
  "Pick up the kids 👶 from school",
  "Meet with Tom for lunch 🍕",
  "Go for a walk 🚶‍♂️ in the park",
  "Fix the broken sink in the bathroom 🚽",
];

interface TaskInterface {
  title: string;
  index: number;
}

const SwipeDelete = () => {
  const TASKS: TaskInterface[] = TITLES.map((title, index) => ({
    title,
    index,
  }));

  const [tasks, setTasks] = useState(TASKS);

  const onDismiss = useCallback((task: TaskInterface) => {
    setTasks((prevTasks) =>
      prevTasks.filter((currentTask) => currentTask.index !== task.index)
    );
  }, []);

  const scrollRef = useRef();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.taskHeading}>Tasks</Text>
      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {tasks.map((task) => (
          <TaskItem
            key={task.index}
            task={task}
            onDismiss={onDismiss}
            simultaneousHandlers={scrollRef}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default SwipeDelete;

const TASK_ITEM_HEIGHT = 70;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

interface TaskItemProps
  extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  task: TaskInterface;
  onDismiss: (task: TaskInterface) => void;
}

const TaskItem = ({ task, onDismiss, simultaneousHandlers }: TaskItemProps) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(TASK_ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);

  const panGestureEventHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onActive: (event) => {
        translateX.value = event.translationX;
      },
      onEnd: () => {
        const shouldBeDimissed = translateX.value < TRANSLATE_X_THRESHOLD;

        if (shouldBeDimissed) {
          translateX.value = withTiming(-SCREEN_WIDTH);
          itemHeight.value = withTiming(0);
          marginVertical.value = withTiming(0);
          opacity.value = withTiming(0, undefined, (isFinished) => {
            if (isFinished) {
              runOnJS(onDismiss)(task);
            }
          });
        } else {
          translateX.value = withTiming(0);
        }
      },
    });

  const rIconContainer = useAnimatedStyle(() => {
    const opacity =
      translateX.value < TRANSLATE_X_THRESHOLD ? withTiming(1) : withTiming(0);
    return { opacity };
  });

  const rTaskContainer = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value,
    };
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View style={[styles.taskContainer, rTaskContainer]}>
      <Animated.View style={[styles.iconContainer, rIconContainer]}>
        <FontAwesome5
          name="trash-alt"
          size={TASK_ITEM_HEIGHT * 0.3}
          color="red"
        />
      </Animated.View>
      <PanGestureHandler
        onGestureEvent={panGestureEventHandler}
        simultaneousHandlers={simultaneousHandlers}
      >
        <Animated.View style={[styles.taskItem, rStyle]}>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFF",
  },
  taskHeading: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: "5%",
  },
  taskContainer: {
    width: "100%",
    alignItems: "center",
  },
  taskItem: {
    width: "90%",
    height: TASK_ITEM_HEIGHT,
    backgroundColor: "white",
    paddingLeft: 20,
    justifyContent: "center",
    elevation: 5,
  },
  taskTitle: {
    fontSize: 16,
  },
  iconContainer: {
    height: TASK_ITEM_HEIGHT,
    width: TASK_ITEM_HEIGHT,
    position: "absolute",
    right: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
});
