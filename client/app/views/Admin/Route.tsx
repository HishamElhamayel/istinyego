import RouteForm from "@components/forms/RouteForm";
import FormOverlay from "@UI/form/FormOverlay";
import KeyboardView from "app/UI/KeyboardView";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Route: FC = () => {
    return (
        <FormOverlay>
            <SafeAreaView style={styles.container}>
                <KeyboardView>
                    <View style={styles.formContainer}>
                        <RouteForm />
                    </View>
                </KeyboardView>
            </SafeAreaView>
        </FormOverlay>
    );
};

export default Route;

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: {
        flex: 1,
    },
});
