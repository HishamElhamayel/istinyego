import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "@views/Auth/ForgotPassword";
import Login from "@views/Auth/Login";
import SignUp from "@views/Auth/SignUp";
import VerifyEmail from "@views/Auth/VerifyEmail";
import React, { FC } from "react";
import { StyleSheet } from "react-native";

export type AuthStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
    SignUp: undefined;
    VerifyEmail: { userId: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface Props {}

const AuthNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen
                name="SignUp"
                options={{
                    presentation: "card",
                    animation: "slide_from_bottom",
                }}
                component={SignUp}
            />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;

const styles = StyleSheet.create({});
