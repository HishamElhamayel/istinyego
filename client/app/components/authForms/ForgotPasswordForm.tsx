import FormInput from "@components/form/FormInput";
import Button from "@components/UI/Button";
import Card from "@components/UI/Card";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const LoginForm = () => {
    const [emailInput, setEmailInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");

    return (
        <Card>
            <View style={{ gap: 15 }}>
                <Text style={styles.header}>Forgot Password</Text>
                <FormInput
                    label="Enter your email"
                    onChangeHandler={(value) => setEmailInput(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    collapsable
                />

                <View style={styles.bottomContainer}>
                    <Button
                        size="medium"
                        onPress={() => console.log(emailInput)}
                        style={styles.button}
                    >
                        Confirm
                    </Button>
                    <Button
                        size="medium"
                        onPress={() => console.log("create account")}
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
