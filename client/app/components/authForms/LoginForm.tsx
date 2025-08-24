import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import FlatButton from "@UI/buttons/FlatButton";
import Card from "@UI/cards/Card";
import FormInput from "@UI/form/FormInput";
import validate, { UserLoginSchema } from "@utils/validator";
import client from "app/API/client";
import runAxiosAsync from "app/API/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { updateAuthState } from "app/store/auth";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";

export interface SignInRes {
    profile: {
        id: string;
        studentId: number;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        favoriteRoutes: string[];
        createdAt: string;
        wallet: string;
    };
    token: string;
    userId?: string;
}

const LoginForm = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = React.useState({
        email: "elhamayelh@gmail.com",
        password: "h!2345678",
    });
    const { email, password } = userInfo;
    const [busy, setBusy] = useState(false);

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(UserLoginSchema, userInfo);
        if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);
        const res = await runAxiosAsync<SignInRes>(
            client.post("/auth/sign-in", values)
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
            showMessage({ message: "Signed in successful ", type: "success" });
            if (res?.token) {
                await AsyncStorage.setItem("access-token", res.token);
                dispatch(
                    updateAuthState({
                        profile: {
                            ...res.profile,
                            token: res.token,
                        },
                        pending: false,
                    })
                );
            }
        }
        setBusy(false);
    };

    return (
        <Card>
            <View style={{ gap: 15 }}>
                <Text style={styles.header}>Login</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <Button
                        size="small"
                        onPress={() =>
                            setUserInfo({
                                email: "elhamayelh@gmail.com",
                                password: "h!2345678",
                            })
                        }
                    >
                        User
                    </Button>
                    <Button
                        size="small"
                        onPress={() =>
                            setUserInfo({
                                email: "220911888@stu.istinye.edu.tr",
                                password: "h!234567",
                            })
                        }
                    >
                        Driver
                    </Button>
                    <Button
                        size="small"
                        onPress={() =>
                            setUserInfo({
                                email: "h.hamayel@hotmail.com",
                                password: "h!234567",
                            })
                        }
                    >
                        Admin
                    </Button>
                </View>
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
