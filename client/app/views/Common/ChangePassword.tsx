import ChangePasswordForm from "@components/authForms/ChangePassword";
import FormOverlay from "@UI/form/FormOverlay";
import KeyboardView from "app/UI/KeyboardView";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePassword: FC = () => {
    return (
        <FormOverlay>
            <SafeAreaView style={styles.container}>
                <KeyboardView>
                    <View style={styles.formContainer}>
                        <ChangePasswordForm />
                    </View>
                </KeyboardView>
            </SafeAreaView>
        </FormOverlay>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
});
