import FormInput from "@components/form/FormInput";
import Button from "@components/UI/Button";
import Card from "@components/UI/Card";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import validate, { ForgotPasswordSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import axios from "axios";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

const LoginForm = () => {
    const [emailInput, setEmailInput] = useState("");
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const [busy, setBusy] = useState(false);

    const handleSubmit = async () => {
        const { values, error } = await validate(ForgotPasswordSchema, {
            email: emailInput,
        });
        if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);
        const res = await runAxiosAsync<{ message: string }>(
            axios.post(
                `http://${
                    Platform.OS === "ios" ? "localhost" : "10.0.2.2"
                }:8989/auth/forget-password`,
                values
            )
        );

        if (res?.message) {
            showMessage({ message: res.message, type: "success" });
            navigation.navigate("Login");
        }
        setBusy(false);
    };

    return (
        <Card>
            <View style={{ gap: 15 }}>
                <Text style={styles.header}>Forgot Password</Text>
                <FormInput
                    label="Enter your email"
                    onChangeText={(value) => setEmailInput(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    collapsable
                />

                <View style={styles.bottomContainer}>
                    <Button
                        size="medium"
                        active={!busy}
                        onPress={handleSubmit}
                        style={styles.button}
                    >
                        Confirm
                    </Button>
                    <Button
                        size="medium"
                        onPress={() => navigation.goBack()}
                        style={styles.button}
                    >
                        Cancel
                    </Button>
                </View>
            </View>
        </Card>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        marginBottom: 15,
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "stretch", // Ensure buttons stretch
        gap: 5, // Optional: Add spacing between buttons
        justifyContent: "space-between", // Add spacing between buttons
        width: "100%", // Ensure full width
    },
    button: {
        flex: 1, // Make each button take equal space
    },
});
