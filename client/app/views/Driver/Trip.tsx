import TripInfo from "@components/TripInfo";
import { RouteProp, useRoute } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import LoadingAnimation from "@UI/LoadingAnimation";
import RouteLocations from "@UI/RouteLocations";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { UserStackParamList } from "app/navigator/UserNavigator";
import { getTripsState, setTrip } from "app/store/trips";
import { DateTime } from "luxon";
import React, { FC, useCallback, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";

interface GetTripRes {
    trip: {
        _id: string;
        startTime: string;
        endTime: string;
        date: string;
        startLocation: string;
        endLocation: string;
        shuttle: {
            _id: string;
            number: number;
        };
        availableSeats: number;
        state: string;
        fare: number;
    };
}

type Props = {};
const Trip: FC = (props: Props) => {
    // Route parameters and authentication client
    const { params } = useRoute<RouteProp<UserStackParamList, "Trip">>();
    const { authClient } = useClient();
    const dispatch = useDispatch();
    const { tripId } = params;
    const { trips } = useSelector(getTripsState);
    const trip = trips.find((trip) => trip._id === tripId);

    // State management
    const [refreshing, setRefreshing] = useState(false);
    const [pending, setPending] = useState(false);

    const [busy, setBusy] = useState(false);

    /**
     * Fetches trip data from the API
     */
    const fetchData = async () => {
        if (!tripId) {
            return;
        }
        const res = await runAxiosAsync<GetTripRes>(
            authClient.get(`/trip/${tripId}`)
        );

        if (res?.trip) {
            dispatch(setTrip(res.trip));
        }

        setPending(false);
        setRefreshing(false);
    };

    const handleStartTrip = async () => {
        setBusy(true);
        const res = await runAxiosAsync<{ message: string }>(
            authClient.patch(`/trip/${tripId}/inProgress`)
        );

        if (res?.message) {
            showMessage({
                message: res.message,
                type: "success",
            });
        }

        fetchData();
        setBusy(false);
    };

    const handleEndTrip = async () => {
        setBusy(true);
        const res = await runAxiosAsync<{ message: string }>(
            authClient.patch(`/trip/${tripId}/completed`)
        );

        if (res?.message) {
            showMessage({
                message: res.message,
                type: "success",
            });
        }

        fetchData();
        setBusy(false);
    };
    const onRefresh = useCallback(() => {
        setRefreshing(true);
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
                {pending && (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                )}
                {!pending && !trip && (
                    <Text style={styles.centerText}>No trip found</Text>
                )}
                {trip && (
                    <>
                        <RouteLocations
                            from={trip.startLocation}
                            to={trip.endLocation}
                        />
                        <View style={{ marginTop: 20, gap: 10 }}>
                            <Text style={styles.centerText}>
                                {DateTime.fromISO(trip.date).toFormat(
                                    "ccc dd MMMM"
                                )}
                            </Text>

                            <Card>
                                <TripInfo trip={trip} />
                                <View style={styles.buttonsContainer}>
                                    <Button
                                        onPress={() => {
                                            console.log("hi");
                                        }}
                                    >
                                        Bookings
                                    </Button>

                                    {trip.state === "inProgress" ? (
                                        <>
                                            <Button
                                                onPress={() => {
                                                    console.log("hi");
                                                }}
                                            >
                                                Open Map
                                            </Button>
                                            <Button
                                                onPress={() => handleEndTrip()}
                                            >
                                                End Trip
                                            </Button>
                                        </>
                                    ) : trip.state === "scheduled" ? (
                                        <Button
                                            onPress={() => handleStartTrip()}
                                        >
                                            Start Trip
                                        </Button>
                                    ) : null}
                                </View>
                            </Card>
                        </View>
                    </>
                )}
                <LoadingAnimation visible={busy} />
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
    centerText: {
        textAlign: "center",
        fontSize: 24,
    },
    balanceText: {
        fontSize: 38,
        color: "white",
    },
    buttonsContainer: {
        marginTop: 25,
        gap: 15,
    },
});
