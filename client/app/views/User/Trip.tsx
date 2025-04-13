/**
 * Trip component displays detailed information about a specific trip and allows users to book it.
 * It shows route locations, trip date, available seats, and booking functionality.
 */

import TripInfo from "@components/TripInfo";
import { RouteProp, useRoute } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import DarkCard from "@UI/cards/DarkCard";
import LoadingAnimation from "@UI/loading/LoadingAnimation";
import RouteLocations from "@UI/ui/RouteLocations";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { UserStackParamList } from "app/navigator/UserNavigator";
import { addBooking, Booking, getBookingsState } from "app/store/bookings";
import { addTransaction, getWalletState, Transaction } from "app/store/wallet";
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
import { useDispatch, useSelector } from "react-redux";

/**
 * Interface for the API response when fetching trip details
 */
export interface GetTripRes {
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

/**
 * Interface for the API response when creating a new booking
 */
export interface GetBookingRes {
    booking: Booking;
    transaction: Transaction;
}

/**
 * Trip component that handles displaying and booking a specific trip
 * Features:
 * - Displays trip details including route, date, and availability
 * - Shows user's current balance
 * - Allows booking the trip if not already booked
 * - Supports pull-to-refresh for updating trip data
 */
const Trip: FC = (props: Props) => {
    // Route parameters and authentication client
    const { params } = useRoute<RouteProp<UserStackParamList, "Trip">>();
    const { authClient } = useClient();

    // State management
    const [refreshing, setRefreshing] = useState(false);
    const [pending, setPending] = useState(true);
    const [trip, setTrip] = useState<GetTripRes["trip"]>();
    const [busy, setBusy] = useState(false);

    // Redux state and dispatch
    const { tripId } = params;
    const { bookings } = useSelector(getBookingsState);
    const { balance } = useSelector(getWalletState);
    const booking = bookings.find((booking) => booking.tripId === tripId);
    const dispatch = useDispatch();

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
            setTrip(res.trip);
        }

        setPending(false);
        setRefreshing(false);
    };

    /**
     * Handles the booking process for the trip
     * Creates a new booking and associated transaction
     */
    const handleBook = async () => {
        if (!tripId) {
            return;
        }
        setBusy(true);
        const res = await runAxiosAsync<GetBookingRes>(
            authClient.post(`/booking/book`, {
                tripId,
            })
        );

        if (res?.booking && res?.transaction) {
            dispatch(addBooking(res.booking));
            dispatch(addTransaction(res.transaction));
        }

        fetchData();
        setBusy(false);
    };

    /**
     * Callback for pull-to-refresh functionality
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    // Initial data fetch on component mount
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

                            {!booking && (
                                <DarkCard>
                                    <Text style={styles.balanceText}>
                                        Balance: {balance?.toFixed(2)}₺
                                    </Text>
                                </DarkCard>
                            )}
                            <Card>
                                <TripInfo trip={trip} />
                                <View style={styles.buttonsContainer}>
                                    {!booking && (
                                        <Button
                                            onPress={() => {
                                                handleBook();
                                            }}
                                        >
                                            Book
                                        </Button>
                                    )}
                                    <Button
                                        onPress={() => {
                                            console.log("hi");
                                        }}
                                    >
                                        Track Shuttle
                                    </Button>
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
