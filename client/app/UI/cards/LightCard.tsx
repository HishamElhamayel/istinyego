import React, { FC } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface Props {
    children?: React.ReactNode;
    onPressHandler?: () => void;
    unPressable?: boolean;
    style?: StyleProp<ViewStyle>;
}

const LightCard: FC<Props> = ({
    children,
    onPressHandler,
    unPressable = false,
    style,
}) => {
    return (
        <Pressable
            onPress={onPressHandler}
            style={({ pressed }) => [
                styles.container,
                !unPressable && pressed && styles.pressed,
                style,
            ]}
        >
            {children}
        </Pressable>
    );
};

export default LightCard;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
    },
    container: {
        gap: 5,
        elevation: 65,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        width: "100%",
        // flex: 1,
    },
    pressed: {
        opacity: 0.7,
    },
});
