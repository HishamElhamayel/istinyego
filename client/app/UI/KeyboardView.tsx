import React, { Children, FC } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from "react-native";

interface Props {
    children?: React.ReactNode;
}

const KeyboardView: FC<Props> = ({ children }) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView keyboardShouldPersistTaps="never">
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default KeyboardView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
