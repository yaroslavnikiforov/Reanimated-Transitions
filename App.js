import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  NativeModules,
  Dimensions,
  Button,
} from "react-native";
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { times } from "lodash";

const { StatusBarManager } = NativeModules;

const CARD_WIDTH = 300;
const CARD_HEIGHT = 200;
const { width, height } = Dimensions.get("window");
const gutter = 16;
const origin = { x: -(width / 2 - gutter), y: 0 };
const colors = [
  generateRandomColor(),
  generateRandomColor(),
  generateRandomColor(),
];

function mix(value, x, y) {
  "worklet";

  // x*(1 - a) + y*a
  return x * (1 - value) + y * value;
}

function generateRandomColor() {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
}

export const useTransition = (state, config) => {
  const value = useSharedValue(0);

  useEffect(() => {
    value.value = typeof state === "boolean" ? (state ? 1 : 0) : state;
  }, [state, value]);

  const transition = useDerivedValue(() => {
    return withTiming(value.value, config);
  });

  return transition;
};

export default function App() {
  const [isToggled, setIsToggled] = useState(false);
  const transition = useTransition(isToggled, { duration: 500 });

  return (
    <View style={styles.container}>
      {times(3, (index) => {
        const style = useAnimatedStyle(() => {
          const rotate = mix(transition.value, 0, ((index - 1) * Math.PI) / 6);

          return {
            transform: [
              { translateX: origin.x },
              { rotate },
              { translateX: -origin.x },
            ],
          };
        });

        return (
          <Animated.View
            key={index}
            style={[styles.card, { backgroundColor: colors[index] }, style]}
          />
        );
      })}

      <Button title="Toggle" onPress={() => setIsToggled((prev) => !prev)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: gutter,
    paddingTop: StatusBarManager.HEIGHT,
  },

  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
  },
});
