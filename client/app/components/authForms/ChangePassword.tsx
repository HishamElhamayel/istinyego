import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import FormInput from "@UI/form/FormInput";
import validate, { ChangePasswordSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface Props {}

interface signUpRes {
    message: string;
}
const ChangePasswordForm: FC<Props> = () => {
    const { authClient } = useClient();
    const [userInfo, setUserInfo] = React.useState({
        oldPassword: "h!234567",
        newPassword: "h!234567",
        confirmPassword: "h!234567",
    });

    const { oldPassword, newPassword, confirmPassword } = userInfo;

    const [busy, setBusy] = useState(false);

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(
            ChangePasswordSchema,
            userInfo
        );
        if (error) return showMessage({ message: error, type: "danger" });

        if (userInfo.newPassword !== userInfo.confirmPassword) {
            return showMessage({
                message: "Passwords do not match",
                type: "danger",
            });
        }

        setBusy(true);
        const res = await runAxiosAsync<signUpRes>(
            authClient.post("/auth/verified-update-password", values)
        );

        if (res?.message) {
            showMessage({ message: res.message, type: "success" });
            navigation.goBack();
        }
        setBusy(false);
    };

    return (
        <View style={{ gap: 15 }}>
            <Text style={styles.header}>Change Password</Text>
            <FormInput
                label="Old Password"
                onChangeText={handleChange("oldPassword")}
                value={oldPassword}
                secureTextEntry
                collapsable
            />
            <FormInput
                label="New Password"
                onChangeText={handleChange("newPassword")}
                value={newPassword}
                secureTextEntry
                collapsable
            />
            <FormInput
                label="Confirm Password"
                onChangeText={handleChange("confirmPassword")}
                value={confirmPassword}
                secureTextEntry
                collapsable
            />
            <Button active={!busy} onPress={handleSubmit}>
                Change Password
            </Button>

            <Button active={!busy} onPress={() => navigation.goBack()}>
                Cancel
            </Button>
        </View>
    );
};

export default ChangePasswordForm;

const styles = StyleSheet.create({
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        marginTop: 15,
    },
});
