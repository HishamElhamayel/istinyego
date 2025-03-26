import FormInput from "@components/form/FormInput";
import Button from "@components/UI/Button";
import Card from "@components/UI/Card";
import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import runAxiosAsync from "app/API/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface verifyEmailRes {
    profile: {
        id: string;
        studentId: number;
        firstName: string;
        lastName: string;
        role: string;
        verified: boolean;
        favoriteRoutes: string[];
        wallet: string;
    };
    message: string;
}

const LoginForm = () => {
    const [token, setToken] = React.useState("");
    const [busy, setBusy] = useState(false);
    const [timer, setTimer] = useState(30); // Timer state
    const [canResend, setCanResend] = useState(false); // Button state

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const route = useRoute<RouteProp<AuthStackParamList, "VerifyEmail">>();

    const { userId } = route.params;

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleResend = async () => {
        const res = await runAxiosAsync<{ message: string }>(
            axios.post(
                `http://${
                    Platform.OS === "ios" ? "localhost" : "10.0.2.2"
                }:8989/auth/reverify-email`,
                { userId }
            )
        );

        if (res?.message) {
            showMessage({ message: res.message, type: "success" });
            setCanResend(false);
            setTimer(30);
        }
    };

    const handleSubmit = async () => {
        setBusy(true);
        const res = await runAxiosAsync<verifyEmailRes>(
            axios.post(
                `http://${
                    Platform.OS === "ios" ? "localhost" : "10.0.2.2"
                }:8989/auth/verify-email`,
                { token, userId }
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
                <Text style={styles.header}>Verify Email</Text>
                <FormInput
                    label="Please Enter the token sent to your email, please check your spam folder"
                    onChangeText={(value) => setToken(value)}
                    value={token}
                    autoCapitalize="none"
                    collapsable
                />

                <View style={styles.buttonContainer}>
                    <Button size="medium" active={!busy} onPress={handleSubmit}>
                        Verify Token
                    </Button>
                    <Button
                        size="medium"
                        onPress={() =>
                            navigation.navigate("Login", undefined, {
                                pop: true,
                            })
                        }
                    >
                        Cancel
                    </Button>
                </View>
                <View style={styles.bottomContainer}>
                    <Text style={styles.bottomText}>Did not receive OTP?</Text>
                    <Button
                        size="small"
                        onPress={handleResend}
                        disabled={!canResend} // Disable button if timer is running
                    >
                        {canResend ? "Send Again" : `Wait ${timer}s`}
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
    buttonContainer: {
        flexDirection: "row",
        alignItems: "stretch",
        gap: 5,
        justifyContent: "space-between",
        width: "100%",
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
