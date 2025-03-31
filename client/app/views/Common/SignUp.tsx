import SignUpForm from "@components/authForms/SignUpForm";
import FormOverlay from "@components/form/FormOverlay";
import KeyboardView from "app/UI/KeyboardView";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp: FC = () => {
    return (
        <FormOverlay>
            <SafeAreaView style={styles.container}>
                <KeyboardView>
                    <View style={styles.formContainer}>
                        <SignUpForm />
                    </View>
                </KeyboardView>
            </SafeAreaView>
        </FormOverlay>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
});
