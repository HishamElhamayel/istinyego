import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { updateAuthState } from "app/store/auth";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";

type Props = {
    showLogout: boolean;
    setShowLogout: Dispatch<SetStateAction<boolean>>;
};

interface LogoutRes {
    message: string;
}

const LogoutModal: FC<Props> = ({ showLogout, setShowLogout }) => {
    const [busy, setBusy] = useState(false);
    const { authClient } = useClient();
    const dispatch = useDispatch();

    const handleLogout = async (fromAll: "yes" | "no") => {
        setBusy(true);
        const res = await runAxiosAsync<LogoutRes>(
            authClient.post("/auth/logout", null, { params: { fromAll } })
        );

        if (res?.message) {
            setShowLogout(false);
            setBusy(false);
            await AsyncStorage.removeItem("access-token");
            dispatch(updateAuthState({ profile: null, pending: false }));
            showMessage({
                message: res.message,
                type: "success",
            });
        }

        setBusy(false);
    };

    return (
        <>
            <Modal animationType="fade" transparent={true} visible={showLogout}>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Card>
                            <Text style={styles.text}>Confirm logout?</Text>
                            <View style={styles.bottomContainer}>
                                <Button
                                    size="medium"
                                    onPress={() => handleLogout("no")}
                                    active={!busy}
                                >
                                    Logout
                                </Button>
                                <Button
                                    size="medium"
                                    onPress={() => setShowLogout(false)}
                                    active={!busy}
                                >
                                    Cancel
                                </Button>
                            </View>
                            <Button
                                onPress={() => handleLogout("yes")}
                                active={!busy}
                            >
                                Logout from all devices
                            </Button>
                        </Card>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default LogoutModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    innerContainer: {
        width: "85%",
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "stretch", // Ensure buttons stretch
        gap: 5, // Optional: Add spacing between buttons
        justifyContent: "space-between", // Add spacing between buttons
        width: "100%", // Ensure full width
        marginBottom: 10,
        marginTop: 30,
    },
    text: {
        textAlign: "center",
        color: "white",
        fontSize: 34,
    },
});
