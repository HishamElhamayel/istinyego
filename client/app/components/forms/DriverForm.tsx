import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import FormInput from "@UI/form/FormInput";
import validate, { CreateDriverSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface Props {}

interface DriverRes {
    message: string;
}

const DriverForm: FC<Props> = () => {
    const { authClient } = useClient();
    const [busy, setBusy] = useState(false);
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();

    const [userInfo, setUserInfo] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        studentId: "",
        password: "",
        confirmPassword: "",
        licenseNumber: "",
    });
    const {
        firstName,
        lastName,
        email,
        studentId,
        password,
        confirmPassword,
        licenseNumber,
    } = userInfo;

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(CreateDriverSchema, userInfo);
        if (error) return showMessage({ message: error, type: "danger" });

        if (userInfo.password !== userInfo.confirmPassword) {
            return showMessage({
                message: "Passwords do not match",
                type: "danger",
            });
        }

        setBusy(true);
        const res = await runAxiosAsync<DriverRes>(
            authClient.post("/auth/register-driver", values)
        );

        if (res?.message) {
            showMessage({ message: res.message, type: "success" });
            navigation.goBack();
        }
        setBusy(false);
    };

    return (
        <View style={{ gap: 15, marginBottom: 30 }}>
            <Text style={styles.header}>Create Driver</Text>
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
                label="Email"
                onChangeText={handleChange("email")}
                value={email}
                keyboardType="email-address"
                collapsable
            />
            <FormInput
                label="Driver ID"
                onChangeText={handleChange("studentId")}
                value={studentId}
                keyboardType="number-pad"
                collapsable
            />
            <FormInput
                label="License Number"
                onChangeText={handleChange("licenseNumber")}
                maxLength={16}
                keyboardType="number-pad"
                value={licenseNumber}
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
            <View style={styles.buttonsContainer}>
                <Button active={!busy} onPress={handleSubmit}>
                    Create Driver
                </Button>
                <Button active={!busy} onPress={() => navigation.goBack()}>
                    Cancel
                </Button>
            </View>
        </View>
    );
};

export default DriverForm;

const styles = StyleSheet.create({
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
    },

    buttonsContainer: {
        marginTop: 20,
        gap: 15,
    },
});
