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
const FlatButton: FC<Props> = ({ children, onPress }) => {
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

export default FlatButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    pressed: {
        opacity: 0.7,
    },
    buttonText: {
        textAlign: "center",
        color: "#0000EE",
    },
});
