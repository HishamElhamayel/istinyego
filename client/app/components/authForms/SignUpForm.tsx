import FormInput from "@components/form/FormInput";
import Button from "@components/UI/Button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import validate, { CreateUserSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import axios from "axios";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

const SignUpForm = () => {
    const [userInfo, setUserInfo] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        studentId: 0,
        password: "",
        confirmPassword: "",
    });

    const [busy, setBusy] = useState(false);
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(CreateUserSchema, userInfo);
        if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);
        const res = await runAxiosAsync<{ message: string }>(
            axios.post("http://localhost:8989/auth/register", values)
        );

        if (res?.message) {
            // console.log(res.message);
            showMessage({ message: res.message, type: "success" });
            navigation.navigate("Login");
        }
        setBusy(false);
    };

    return (
        <View style={{ gap: 15 }}>
            <Text style={styles.header}>Create Account</Text>
            <FormInput
                label="First Name"
                onChangeText={handleChange("firstName")}
                collapsable
            />
            <FormInput
                label="Last Name"
                onChangeText={handleChange("lastName")}
                collapsable
            />
            <FormInput
                label="Student ID"
                onChangeText={handleChange("studentId")}
                keyboardType="email-address"
                autoCapitalize="none"
                collapsable
            />
            <FormInput
                label="Email"
                onChangeText={handleChange("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                collapsable
            />

            <FormInput
                label="Password"
                onChangeText={handleChange("password")}
                secureTextEntry
            />
            <FormInput
                label="Confirm Password"
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
