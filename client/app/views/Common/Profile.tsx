import LogoutModal from "@components/authForms/LogoutModal";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import Header from "@UI/Header";
import Info from "@UI/info";
import useAuth from "app/hooks/useAuth";
import { UserStackParamList } from "app/navigator/UserNavigator";
import { DateTime } from "luxon";
import React, { FC, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const Trip: FC = (props: Props) => {
    const { authState } = useAuth();
    const profile = authState.profile;
    const navigation = useNavigation<NavigationProp<UserStackParamList>>();
    const [showLogout, setShowLogout] = useState(false);

    if (!profile) {
        return <Text style={styles.centerText}>No trip found</Text>;
    }

    return (
        <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
            <ScrollView style={{ overflow: "visible" }}>
                <Header>Profile</Header>
                <Card>
                    <Info title="Name">
                        {profile.firstName.charAt(0).toUpperCase() +
                            profile.firstName.slice(1)}{" "}
                        {profile.lastName.charAt(0).toUpperCase() +
                            profile.lastName.slice(1)}
                    </Info>

                    <Info title="Email">{profile.email}</Info>
                    <Info title="Student Number">{profile.studentId}</Info>
                    <Info title="Joined">
                        {DateTime.fromISO(profile.createdAt).toLocaleString(
                            DateTime.DATE_FULL
                        )}
                    </Info>

                    <View style={styles.buttonsContainer}>
                        <Button
                            onPress={() => navigation.navigate("EditAccount")}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            onPress={() =>
                                navigation.navigate("ChangePassword")
                            }
                        >
                            Change Password
                        </Button>
                        <Button onPress={() => setShowLogout(true)}>
                            Logout
                        </Button>
                    </View>
                    <LogoutModal
                        showLogout={showLogout}
                        setShowLogout={setShowLogout}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Trip;

// Styles definition
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    loading: {
        marginTop: 200,
    },
    buttonsContainer: {
        marginTop: 25,
        gap: 10,
    },
    centerText: {
        textAlign: "center",
        fontSize: 24,
    },
});
