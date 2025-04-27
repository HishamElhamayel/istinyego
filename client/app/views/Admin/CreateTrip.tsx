import DriverForm from "@components/forms/DriverForm";
import TripForm from "@components/forms/TripForm";
import FormOverlay from "@UI/form/FormOverlay";
import KeyboardView from "app/UI/KeyboardView";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateTrip: FC = () => {
    return (
        <FormOverlay>
            <SafeAreaView style={styles.container}>
                <KeyboardView>
                    <View style={styles.formContainer}>
                        <TripForm />
                    </View>
                </KeyboardView>
            </SafeAreaView>
        </FormOverlay>
    );
};

export default CreateTrip;

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: {
        flex: 1,
    },
});
