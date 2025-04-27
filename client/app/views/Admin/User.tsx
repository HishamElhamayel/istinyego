import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Card from "@UI/cards/Card";
import DarkCard from "@UI/cards/DarkCard";
import Header from "@UI/ui/Header";
import Info from "@UI/ui/Info";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AdminStackParamList } from "app/navigator/AdminNavigator";
import { DateTime } from "luxon";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

interface GetUserRes {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        verified: boolean;
        studentId: number;
        createdAt: string;
        shuttle: {
            _id: string;
            number: number;
        } | null;
        wallet: {
            _id: string;
            balance: number;
        };
        transactions:
            | {
                  _id: string;
                  amount: number;
                  createdAt: string;
                  type: string;
              }[]
            | [];
    };
}
const User: FC = (props: Props) => {
    const route = useRoute<RouteProp<AdminStackParamList, "User">>();
    const { _id } = route.params;
    const { authClient } = useClient();
    const [pending, setPending] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState<GetUserRes["user"] | null>(null);

    const fetchData = async () => {
        // Fetch user bookings
        const res = await runAxiosAsync<GetUserRes>(
            authClient.get(`/profile/${_id}`)
        );
        if (res?.user) {
            setUser(res.user);
        }
        setPending(false); // Stop loading indicator
        setRefreshing(false); // Stop pull-to-refresh indicator
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true); // Start pull-to-refresh indicator
        fetchData(); // Fetch data
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
            <ScrollView
                style={{ overflow: "visible" }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // Show refresh indicator while loading
                        onRefresh={onRefresh} // Trigger refresh on pull
                    />
                }
            >
                <Header>User Info</Header>
                {pending && (
                    <ActivityIndicator size="large" color={colors.primary100} />
                )}
                {!pending && !user && (
                    <Text style={styles.centerText}>No user found</Text>
                )}
                {!pending && user && (
                    <Card>
                        <Info title="Name">
                            {user?.firstName.charAt(0).toUpperCase() +
                                user?.firstName.slice(1)}{" "}
                            {user?.lastName.charAt(0).toUpperCase() +
                                user?.lastName.slice(1)}
                        </Info>

                        <Info title="Email">{user?.email}</Info>

                        {user.role === "user" && (
                            <Info title="Student Number">
                                {user?.studentId}
                            </Info>
                        )}
                        {user.role === "driver" && (
                            <Info title="Staff Number">{user?.studentId}</Info>
                        )}
                        <Info title="Role">
                            {user?.role.charAt(0).toUpperCase() +
                                user?.role.slice(1)}
                        </Info>

                        <Info title="Verified">
                            {user?.verified ? "Yes" : "No"}
                        </Info>
                        <Info title="Joined">
                            {DateTime.fromISO(user?.createdAt).toLocaleString(
                                DateTime.DATE_FULL
                            )}
                        </Info>
                    </Card>
                )}

                {user?.role === "driver" && user?.shuttle ? (
                    <DarkCard title="Assigned Shuttle">
                        ISU - {user?.shuttle.number.toString().padStart(2, "0")}
                    </DarkCard>
                ) : user?.role === "user" ? (
                    <DarkCard title="Wallet">
                        {user?.wallet.balance.toFixed(2)}₺
                    </DarkCard>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
};

export default User;

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
