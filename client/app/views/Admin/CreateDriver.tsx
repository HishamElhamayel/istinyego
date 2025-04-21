import DriverForm from "@components/forms/DriverForm";
import FormOverlay from "@UI/form/FormOverlay";
import KeyboardView from "app/UI/KeyboardView";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateDriver: FC = () => {
    return (
        <FormOverlay>
            <SafeAreaView style={styles.container}>
                <KeyboardView>
                    <View style={styles.formContainer}>
                        <DriverForm />
                    </View>
                </KeyboardView>
            </SafeAreaView>
        </FormOverlay>
    );
};

export default CreateDriver;

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: {
        flex: 1,
    },
});
