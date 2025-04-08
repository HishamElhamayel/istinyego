import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

import colors from "@utils/colors";
import { FC } from "react";

interface Props extends PressableProps {
    children?: any;
    onPress: () => void;
    size?: "small" | "medium" | "large";
    active?: boolean;
}

const Button: FC<Props> = ({ children, onPress, size, active = true }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                (pressed || !active) && styles.pressed,
                size === "small" || size === "medium" ? { flex: 1 } : {},
            ]}
            onPress={active ? onPress : null}
        >
            <Text
                style={[
                    size === "small"
                        ? styles.small
                        : size === "medium"
                        ? styles.medium
                        : styles.large,
                    styles.buttonText,
                ]}
            >
                {children}
            </Text>
        </Pressable>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "white",
        elevation: 2,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    pressed: {
        opacity: 0.7,
    },
    buttonText: { textAlign: "center", color: colors.primary100 },
    small: {
        fontSize: 18,
    },
    medium: {
        fontSize: 20,
    },
    large: {
        fontSize: 22,
        fontWeight: "bold",
    },
});
