import FormInput from "@components/form/FormInput";
import Button from "@components/UI/Button";
import Card from "@components/UI/Card";
import FlatButton from "@components/UI/FlatButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const LoginForm = () => {
    const [userInfo, setUserInfo] = React.useState({ email: "", password: "" });

    const { email, password } = userInfo;

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
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

                <Button
                    onPress={() =>
                        console.log(userInfo.email, userInfo.password)
                    }
                >
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
