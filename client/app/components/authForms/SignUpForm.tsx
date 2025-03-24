import FormInput from "@components/form/FormInput";
import Button from "@components/UI/Button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import axios from "axios";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import * as yup from "yup";

const CreateUserSchema = yup.object({
    firstName: yup
        .string()
        .required("First name is missing")
        .min(3, "First name is too short")
        .max(30, "First name is too long"),
    lastName: yup
        .string()
        .required("Last name is missing")
        .min(3, "Last name is too short")
        .max(30, "Last name is too long"),
    email: yup.string().email("Invalid Email").required("Email is missing"),
    password: yup
        .string()
        .required("Password is missing")
        .min(8, "Password is too short")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password must contain at least one letter, one number and one special character"
        ),
    studentId: yup.number().required("ID is missing"),
});

const SignUpForm = () => {
    const [userInfo, setUserInfo] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        studentId: "",
        password: "",
        confirmPassword: "",
    });

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    const handleSubmit = async () => {
        try {
            const info = await CreateUserSchema.validate(userInfo);
            const { data } = await axios.post(
                "http://localhost:8989/auth/register",
                info
            );
            console.log(data);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                console.log("invalid Form:", error.message);
            } else if (error instanceof axios.AxiosError) {
                const response = error.response;
                console.log(error);
                if (response) {
                    console.log("Axios Error:", response.data);
                }
            } else {
                console.log((error as any).message);
            }
        }
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

            <Button onPress={handleSubmit}>Create Account</Button>

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
