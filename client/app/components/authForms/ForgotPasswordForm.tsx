import FormInput from "@components/form/FormInput";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import validate, { ForgotPasswordSchema } from "@utils/validator";
import client from "app/API/client";
import runAxiosAsync from "app/API/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import axios from "axios";
import React, { FC, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface Props {}
const LoginForm: FC<Props> = () => {
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
            client.post("/auth/forget-password", values)
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
                    <Button size="medium" active={!busy} onPress={handleSubmit}>
                        Confirm
                    </Button>
                    <Button size="medium" onPress={() => navigation.goBack()}>
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
});
