import LoginForm from "@components/login/LoginForm";
import React from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require("../../assets/icon.png")}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </View>
                <LoginForm />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: { flex: 1 },
    logoContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 180,
        height: 180,
    },
});
