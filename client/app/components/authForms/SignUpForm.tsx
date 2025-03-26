import FormInput from "@components/form/FormInput";
import Button from "@components/UI/Button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import validate, { CreateUserSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import axios from "axios";
import React, { FC, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface Props {}

interface signUpRes {
    userId: string;
    message: string;
}
const SignUpForm: FC<Props> = () => {
    const [userInfo, setUserInfo] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        studentId: "",
        password: "",
        confirmPassword: "",
    });

    const { firstName, lastName, email, studentId, password, confirmPassword } =
        userInfo;

    const [busy, setBusy] = useState(false);

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(CreateUserSchema, userInfo);
        if (error) return showMessage({ message: error, type: "danger" });

        if (userInfo.password !== userInfo.confirmPassword) {
            return showMessage({
                message: "Passwords do not match",
                type: "danger",
            });
        }

        setBusy(true);
        const res = await runAxiosAsync<signUpRes>(
            axios.post(
                `http://${
                    Platform.OS === "ios" ? "localhost" : "10.0.2.2"
                }:8989/auth/register`,
                values
            )
        );

        if (res?.message) {
            showMessage({ message: res.message, type: "success" });
            navigation.navigate("VerifyEmail", { userId: res.userId });
        }
        setBusy(false);
    };

    return (
        <View style={{ gap: 15 }}>
            <Text style={styles.header}>Create Account</Text>
            <FormInput
                label="First Name"
                onChangeText={handleChange("firstName")}
                value={firstName}
                collapsable
            />
            <FormInput
                label="Last Name"
                onChangeText={handleChange("lastName")}
                value={lastName}
                collapsable
            />
            <FormInput
                label="Student ID"
                onChangeText={handleChange("studentId")}
                value={studentId.toString()}
                keyboardType="email-address"
                autoCapitalize="none"
                collapsable
            />
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
                value={password}
                onChangeText={handleChange("password")}
                secureTextEntry
            />
            <FormInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                secureTextEntry
            />

            <Button active={!busy} onPress={handleSubmit}>
                Create Account
            </Button>

            <View style={styles.bottomContainer}>
                <Text style={styles.bottomText}>Already have an account?</Text>
                <Button size="small" onPress={() => navigation.goBack()}>
                    Login
                </Button>
            </View>
        </View>
    );
};

export default SignUpForm;

const styles = StyleSheet.create({
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        marginTop: 15,
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
