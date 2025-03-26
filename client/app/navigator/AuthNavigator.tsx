import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "@views/forgotPassword";
import Login from "@views/Login";
import SignUp from "@views/SignUp";
import React, { FC } from "react";
import { StyleSheet } from "react-native";

export type AuthStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
    SignUp: undefined;
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
        </Stack.Navigator>
    );
};

export default AuthNavigator;

const styles = StyleSheet.create({});
