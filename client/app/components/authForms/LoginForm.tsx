import FormInput from "@components/form/FormInput";
import Button from "@components/UI/Button";
import Card from "@components/UI/Card";
import FlatButton from "@components/UI/FlatButton";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const LoginForm = () => {
    const [emailInput, setEmailInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");

    return (
        <Card>
            <View style={{ gap: 15 }}>
                <Text style={styles.header}>Login</Text>
                <FormInput
                    label="Email"
                    onChangeHandler={(value) => setEmailInput(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    collapsable
                />

                <FormInput
                    label="Password"
                    onChangeHandler={(value) => setPasswordInput(value)}
                    secureTextEntry
                />

                <Button onPress={() => console.log(emailInput)}>Login</Button>

                <View style={{ alignItems: "flex-end" }}>
                    <FlatButton onPress={() => console.log("forgot password")}>
                        Forgot Password
                    </FlatButton>
                </View>

                <View style={styles.bottomContainer}>
                    <Text style={styles.bottomText}>Not a user yet?</Text>
                    <Button
                        size="small"
                        onPress={() => console.log("create account")}
                    >
                        Create Account
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
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    bottomText: {
        color: "white",
    },
});
