import FormInput from "@components/form/FormInput";
import Button from "@components/UI/Button";
import Card from "@components/UI/Card";
import FlatButton from "@components/UI/FlatButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import validate, { UserLoginSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import axios from "axios";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface signInRes {
    profile?: {
        id: string;
        studentId: number;
        firstName: string;
        lastName: string;
        role: string;
        verified: boolean;
        favoriteRoutes: string[];
        wallet: string;
    };
    tokens?: object;
    userId?: string;
}

const LoginForm = () => {
    const [userInfo, setUserInfo] = React.useState({ email: "", password: "" });

    const { email, password } = userInfo;
    const [busy, setBusy] = useState(false);

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(UserLoginSchema, userInfo);
        if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);
        const res = await runAxiosAsync<signInRes>(
            axios.post(
                `http://${
                    Platform.OS === "ios" ? "localhost" : "10.0.2.2"
                }:8989/auth/sign-in`,
                values
            )
        );

        if (res?.userId) {
            showMessage({
                message:
                    "To access your account, please verify your email, email sent",
                type: "warning",
            });
            navigation.navigate("VerifyEmail", { userId: res?.userId });
            setBusy(false);
        }

        if (res?.profile) {
            console.log(res.profile);
            showMessage({ message: "Signed in ", type: "success" });
            navigation.navigate("Login");
        }
        setBusy(false);
    };

    return (
        <Card>
            <View style={{ gap: 15 }}>
                <Text style={styles.header}>Login</Text>
                <FormInput
                    label="Email"
                    onChangeText={handleChange("email")}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    collapsable
                />

                <FormInput
                    label="Password"
                    onChangeText={handleChange("password")}
                    value={password}
                    secureTextEntry
                />

                <Button active={!busy} onPress={handleSubmit}>
                    Login
                </Button>

                <View style={{ alignItems: "flex-end" }}>
                    <FlatButton
                        onPress={() => navigation.navigate("ForgotPassword")}
                    >
                        Forgot Password
                    </FlatButton>
                </View>

                <View style={styles.bottomContainer}>
                    <Text style={styles.bottomText}>Not a user yet?</Text>
                    <Button
                        size="small"
                        onPress={() => navigation.navigate("SignUp")}
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
