import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

import colors from "@utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";

interface Props extends PressableProps {
    children?: any;
    onPress: () => void;
    active?: boolean;
}

const BlueButton: FC<Props> = ({ children, onPress, active = true }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                (pressed || !active) && styles.pressed,
            ]}
            onPress={active ? onPress : null}
        >
            <LinearGradient
                style={styles.button}
                colors={[colors.primary100, colors.primary50]}
            >
                <Text style={styles.buttonText}>{children}</Text>
            </LinearGradient>
        </Pressable>
    );
};

export default BlueButton;

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 16,
    },
    pressed: {
        opacity: 0.7,
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontSize: 28,
    },
});
