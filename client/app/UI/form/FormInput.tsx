import React, { FC } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

interface props extends TextInputProps {
    label: string;
}
const FormInput: FC<props> = (props) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                style={[
                    styles.input,
                    isFocused ? styles.borderActive : styles.borderInActive,
                ]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </View>
    );
};

export default FormInput;

const styles = StyleSheet.create({
    container: {
        // marginBottom: 15,
        flex: 1,
    },
    label: {
        color: "white",
        marginBottom: 5,
    },
    input: {
        color: "white",
        borderRadius: 8,
        padding: 10,
        fontSize: 20,
    },
    borderActive: {
        borderColor: "#FFFFFF",
        borderWidth: 1,
    },
    borderInActive: {
        borderColor: "#CCCCCC",
        borderWidth: 1,
    },
});
