import FormInput from "@components/form/FormInput";
import FormOverlay from "@components/form/FormOverlay";
import Button from "@components/UI/Button";
import FlatButton from "@components/UI/FlatButton";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const LoginForm = () => {
    const [emailInput, setEmailInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");

    return (
        <FormOverlay>
            <ScrollView
                keyboardShouldPersistTaps="never"
                keyboardDismissMode="on-drag"
            >
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

                    <Button onPress={() => console.log(emailInput)}>
                        Login
                    </Button>

                    <View style={{ alignItems: "flex-end" }}>
                        <FlatButton
                            onPress={() => console.log("forgot password")}
                        >
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
            </ScrollView>
        </FormOverlay>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        marginBottom: 20,
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
