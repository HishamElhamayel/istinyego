import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import FormInput from "@UI/form/FormInput";
import validate, { UpdateUserSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import useClient from "app/hooks/useClient";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { Profile, updateAuthState } from "app/store/auth";
import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";

interface Props {}

interface signUpRes {
    user: Profile;
}
const EditAccountForm: FC<Props> = () => {
    const { authClient } = useClient();
    const { authState } = useAuth();
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = React.useState({
        firstName: authState.profile?.firstName,
        lastName: authState.profile?.lastName,
        email: authState.profile?.email,
        studentId: authState.profile?.studentId,
    });

    const token = authState.profile?.token;

    const { firstName, lastName, email, studentId } = userInfo;

    const [busy, setBusy] = useState(false);

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(UpdateUserSchema, userInfo);
        if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);
        const res = await runAxiosAsync<signUpRes>(
            authClient.patch("/profile/update-profile", values)
        );

        if (res?.user) {
            showMessage({ message: "Profile updated", type: "success" });
            dispatch(
                updateAuthState({
                    profile: { ...res.user, token: token || "" },
                    pending: false,
                })
            );
            navigation.goBack();
        }
        setBusy(false);
    };

    return (
        <View style={{ gap: 15 }}>
            <Text style={styles.header}>Edit Account</Text>
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
                label="Student ID"
                onChangeText={handleChange("studentId")}
                value={studentId?.toString() || ""}
                keyboardType="numeric"
                collapsable
            />

            <Button active={!busy} onPress={handleSubmit}>
                Update Profile
            </Button>

            <Button active={!busy} onPress={() => navigation.goBack()}>
                Cancel
            </Button>
        </View>
    );
};

export default EditAccountForm;

const styles = StyleSheet.create({
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        marginTop: 15,
    },
});
