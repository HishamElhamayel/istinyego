import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import SearchInput from "@UI/form/SearchInput";
import Loading from "@UI/loading/Loading";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { DriverStackParamList } from "app/navigator/DriverNavigator";
import React, { FC, useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GetBookingsRes {
    bookings: {
        _id: string;
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            studentId: number;
        };
    }[];
}

type Props = {};

const Bookings: FC<Props> = () => {
    const { authClient } = useClient();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<DriverStackParamList, "Bookings">>();
    const [pending, setPending] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [bookings, setBookings] = useState<GetBookingsRes["bookings"]>([]);
    const { tripId } = route.params;
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        if (!tripId) {
            return;
        }
        const res = await runAxiosAsync<GetBookingsRes>(
            authClient.get(`/booking/bookings-by-tripId`, {
                params: {
                    tripId,
                },
            })
        );

        if (res?.bookings) {
            setBookings(res.bookings);
        }

        setPending(false);
        setRefreshing(false);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
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
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Loading visible={pending} />
                <Card style={styles.innerContainer}>
                    <SearchInput
                        label="Search by Name or Student ID"
                        onChangeText={setSearch}
                        placeholder="Type to search..."
                    />
                    <Button onPress={() => navigation.goBack()}>Back</Button>
                    {bookings.length > 0 ? (
                        bookings
                            .filter((booking) => {
                                const searchLower = search.toLowerCase();
                                const fullName =
                                    `${booking.user.firstName} ${booking.user.lastName}`.toLowerCase();
                                return (
                                    fullName.includes(searchLower) ||
                                    booking.user.studentId
                                        .toString()
                                        .includes(search)
                                );
                            })
                            .map((booking) => (
                                <LightCard key={booking._id} unPressable>
                                    <Text style={styles.nameText}>
                                        {booking.user.firstName
                                            .charAt(0)
                                            .toUpperCase() +
                                            booking.user.firstName.slice(
                                                1
                                            )}{" "}
                                        {booking.user.lastName}
                                    </Text>
                                    <Text style={styles.studentIdText}>
                                        {booking.user.studentId}
                                    </Text>
                                </LightCard>
                            ))
                    ) : (
                        <Text style={styles.noResultsText}>
                            No bookings found
                        </Text>
                    )}
                    {search.length > 0 &&
                        bookings.filter((booking) => {
                            const searchLower = search.toLowerCase();
                            const fullName =
                                `${booking.user.firstName} ${booking.user.lastName}`.toLowerCase();
                            return (
                                fullName.includes(searchLower) ||
                                booking.user.studentId
                                    .toString()
                                    .includes(search)
                            );
                        }).length === 0 && (
                            <Text style={styles.noResultsText}>
                                No results found for "{search}"
                            </Text>
                        )}
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Bookings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    centerText: {
        textAlign: "center",
        fontSize: 24,
    },
    innerContainer: {
        gap: 15,
    },
    nameText: {
        fontSize: 24,
    },
    studentIdText: {
        fontSize: 16,
    },
    noResultsText: {
        textAlign: "center",
        fontSize: 16,
        color: "white",
        marginTop: 20,
    },
});
