import FormInput from "@components/Form/FormInput";
import FormOverlay from "@components/Form/FormOverlay";
import Button from "@components/UI/Button";
import FlatButton from "@components/UI/FlatButton";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
    const [emailInput, setEmailInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require("../../assets/icon.png")}
                    resizeMode="contain"
                    resizeMethod="resize"
                />
            </View>

            <FormOverlay>
                <Text style={styles.header}>Login</Text>
                <FormInput
                    label="Email"
                    onChangeHandler={(value) => setEmailInput(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
            </FormOverlay>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {},
    logoContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 200,
        height: 200,
    },
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
