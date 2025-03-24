import LoginForm from "@components/authForms/LoginForm";
import React from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={styles.innerContainer}
                    keyboardShouldPersistTaps="never"
                >
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            source={require("../../assets/icon.png")}
                            resizeMode="contain"
                            resizeMethod="resize"
                        />
                    </View>
                    <View style={styles.formContainer}>
                        <LoginForm />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: { flex: 1 },
    innerContainer: {
        flex: 1,
    },
    logoContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 180,
        height: 180,
        elevation: 2,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    formContainer: {
        flex: 3,
    },
});
