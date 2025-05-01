import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import FormInput from "@UI/form/FormInput";
import client from "app/API/client";
import runAxiosAsync from "app/API/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    const [token, setToken] = React.useState(""); // State for the token input
    const [busy, setBusy] = useState(false); // State to track if the form is busy
    const [timer, setTimer] = useState(30); // Timer state for the resend button
    const [canResend, setCanResend] = useState(false); // State to enable/disable the resend button

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const route = useRoute<RouteProp<AuthStackParamList, "VerifyEmail">>();

    const { userId } = route.params; // Extract userId from route parameters

    // Effect to start the timer when the component loads
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval); // Clear the timer when it reaches 0
                    setCanResend(true); // Enable the resend button
                    return 0;
                }
                return prev - 1; // Decrement the timer
            });
        }, 1000);

        return () => clearInterval(interval); // Cleanup the timer on unmount
    }, [canResend]);

    // Function to handle the resend button click
    const handleResend = async () => {
        const res = await runAxiosAsync<{ message: string }>(
            client.post("/auth/reverify-email", {
                userId,
            })
        );

        if (res?.message) {
            showMessage({ message: res.message, type: "success" }); // Show success message
            setCanResend(false); // Disable the button
            setTimer(30); // Reset the timer
        }
    };

    // Function to handle the form submission
    const handleSubmit = async () => {
        setBusy(true); // Set the form to busy state
        const res = await runAxiosAsync<verifyEmailRes>(
            client.post(`/auth/verify-email`, { token, userId })
        );

        if (res?.message) {
            showMessage({ message: res.message, type: "success" }); // Show success message
            navigation.navigate("Login"); // Navigate to the Login screen
        }
        setBusy(false); // Reset the busy state
    };

    return (
        <Card>
            <View style={{ gap: 15 }}>
                <Text style={styles.header}>Verify Email</Text>
                <FormInput
                    label="Please Enter the token sent to your email, please check your spam folder"
                    onChangeText={(value) => setToken(value)} // Update token state
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
                        onPress={handleResend} // Resend OTP
                        active={canResend} // Enable/disable button based on timer
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
