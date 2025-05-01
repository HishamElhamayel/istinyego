import colors from "@utils/colors";
import { FC } from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface Props extends PressableProps {
    children?: any;
    onPress: () => void;
    active?: boolean;
}

const RedButton: FC<Props> = ({ children, onPress, active = true }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                (pressed || !active) && styles.pressed,
            ]}
            onPress={active ? onPress : null}
        >
            <Text style={styles.buttonText}>{children}</Text>
        </Pressable>
    );
};

export default RedButton;

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        borderRadius: 8,
        paddingVertical: 8,
        backgroundColor: colors.red50,
    },

    pressed: {
        opacity: 0.7,
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontSize: 22,
    },
});
