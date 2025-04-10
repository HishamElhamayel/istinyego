import EditAccountForm from "@components/authForms/EditAccountForm";
import FormOverlay from "@UI/form/FormOverlay";
import KeyboardView from "app/UI/KeyboardView";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditAccount: FC = () => {
    return (
        <FormOverlay>
            <SafeAreaView style={styles.container}>
                <KeyboardView>
                    <View style={styles.formContainer}>
                        <EditAccountForm />
                    </View>
                </KeyboardView>
            </SafeAreaView>
        </FormOverlay>
    );
};

export default EditAccount;

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
});
