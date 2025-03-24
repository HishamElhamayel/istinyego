import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";

import colors from "@utils/colors";
import { FC } from "react";

interface Props extends PressableProps {
  children?: any;
  onPress: () => void;
}

const Button: FC<Props> = ({ children, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: colors.primary100,
    fontSize: 22,
    fontWeight: "bold",
  },
});
