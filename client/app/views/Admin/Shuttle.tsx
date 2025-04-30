import UpcomingTripsList from "@components/lists/UpcomingTripsList";
import {
    NavigationProp,
    RouteProp,
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import DatePicker from "@UI/form/DatePicker";
import Header from "@UI/ui/Header";
import Info from "@UI/ui/Info";
import colors from "@utils/colors";
import { GetTripsRes } from "@views/Driver/Home";
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
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

export interface GetShuttleRes {
    shuttle: {
        _id: string;
        number: number;
        coordinates: {
            type: string;
            coordinates: number[];
        };
        capacity: number;
        driver: {
            _id: string;
            firstName: string;
            lastName: string;
            studentId: number;
        };
    };
}
const User: FC = (props: Props) => {
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();
    const route = useRoute<RouteProp<AdminStackParamList, "Shuttle">>();
    const { shuttleId } = route.params;
    const { authClient } = useClient();
    const [pending, setPending] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [shuttle, setShuttle] = useState<GetShuttleRes["shuttle"]>();
    const [date, setDate] = useState<Date>(new Date());
    const [trips, setTrips] = useState<GetTripsRes["trips"]>([]);

    const fetchData = async () => {
        // Fetch user bookings
        setPending(true); // Start loading indicator
        const res = await runAxiosAsync<GetShuttleRes>(
            authClient.get(`/shuttle/${shuttleId}`)
        );
        if (res?.shuttle) {
            setShuttle(res.shuttle);
        }
        setPending(false); // Stop loading indicator
        setRefreshing(false); // Stop pull-to-refresh indicator
    };

    const fetchTrips = async () => {
        const res = await runAxiosAsync<GetTripsRes>(
            authClient.get("/trip/trips-by-shuttle", {
                params: {
                    shuttleId: shuttleId,
                    date: DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"),
                },
            })
        );

        setTrips(res?.trips || []);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true); // Start pull-to-refresh indicator
        fetchTrips();
        fetchData(); // Fetch data
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    useEffect(() => {
        fetchTrips();
    }, [date]);

    const navigateToEditShuttle = () => {
        navigation.navigate("CreateShuttle", {
            shuttle: shuttle,
        });
    };
    const navigateToTrackShuttle = () => {
        if (!shuttle)
            return showMessage({
                message: "Error trying to access shuttle data, try again later",
                type: "danger",
            });

        navigation.navigate("TrackShuttle", {
            shuttleId: shuttle?._id,
        });
    };

    const navigateToCreateTrip = () => {
        if (!shuttle)
            return showMessage({
                message: "Error trying to access shuttle data, try again later",
                type: "danger",
            });

        navigation.navigate("CreateTrip", {
            shuttleId: shuttleId,
            date: DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"),
            availableSeats: shuttle.capacity,
        });
    };

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
                {shuttle ? (
                    <Header>
                        ISU - {shuttle.number.toString().padStart(2, "0")}
                    </Header>
                ) : (
                    <Header>Shuttle</Header>
                )}
                {pending && (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                )}
                {!pending && !shuttle && (
                    <Text style={styles.centerText}>No shuttle found</Text>
                )}
                {!pending && shuttle && (
                    <>
                        <Card>
                            <View style={styles.shuttleInfo}>
                                <Info title="Driver Name" style={styles.info}>
                                    {shuttle?.driver.firstName
                                        .charAt(0)
                                        .toUpperCase() +
                                        shuttle?.driver.firstName.slice(1)}{" "}
                                    {shuttle?.driver.lastName
                                        .charAt(0)
                                        .toUpperCase() +
                                        shuttle?.driver.lastName.slice(1)}
                                </Info>

                                <Info title="Capacity" style={styles.info}>
                                    {shuttle?.capacity}
                                </Info>
                            </View>
                            <View style={styles.buttonsContainer}>
                                <Button onPress={navigateToEditShuttle}>
                                    Edit Shuttle
                                </Button>
                                <Button onPress={navigateToTrackShuttle}>
                                    Track Shuttle
                                </Button>
                            </View>
                        </Card>
                        <DatePicker date={date} setParentDate={setDate} />

                        <UpcomingTripsList
                            trips={trips}
                            title="Upcoming Trips"
                            onCreateNew={navigateToCreateTrip}
                        />
                    </>
                )}
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
    shuttleInfo: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    info: { justifyContent: "flex-start", flex: 1 },
    centerText: {
        textAlign: "center",
        fontSize: 24,
    },
    buttonsContainer: {
        marginTop: 20,
        gap: 10,
    },
});
