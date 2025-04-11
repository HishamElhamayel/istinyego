import Header from "app/UI/Header"; // Header component for the screen

// Import utilities and hooks
import colors from "@utils/colors"; // Color constants for styling
import runAxiosAsync from "app/API/runAxiosAsync"; // Utility function for making API calls
import useAuth from "app/hooks/useAuth"; // Custom hook for authentication state
import useClient from "app/hooks/useClient"; // Custom hook for API client
import { getTripsState, setTrips } from "app/store/trips";
// Import Redux related utilities

// Import React and React Native components
import UpcomingTripsList from "@components/Lists/upcomingTripsList";
import { FC, useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator, // Loading spinner component
    RefreshControl, // Pull-to-refresh functionality
    ScrollView, // Scrollable container
    StyleSheet, // Style creation utility
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Safe area wrapper for iOS
import { useDispatch, useSelector } from "react-redux";

// Interface definitions for API response types
interface GetShuttleRes {
    shuttle: {
        _id: string;
        number: number;
    };
}

interface GetTripsRes {
    trips: {
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
    }[];
}

interface Props {}
const Home: FC<Props> = () => {
    // Get authentication state and client
    const { authState } = useAuth();
    const { authClient } = useClient();
    const profile = authState.profile;
    const firstName = profile?.firstName;

    // State management
    const [refreshing, setRefreshing] = useState(false);
    const [pending, setPending] = useState(true);
    const [shuttle, setShuttle] = useState<GetShuttleRes["shuttle"]>();
    const today = "2025-04-14";

    const dispatch = useDispatch();
    const { trips } = useSelector(getTripsState);

    // Fetch trips data
    const fetchData = async () => {
        if (!shuttle?._id) return;

        setPending(true);
        const tripsRes = await runAxiosAsync<GetTripsRes>(
            authClient.get("/trip/trips-by-shuttle", {
                params: {
                    shuttleId: shuttle._id,
                    date: today,
                },
            })
        );

        if (tripsRes?.trips) {
            dispatch(setTrips(tripsRes.trips));
        }

        setPending(false);
        setRefreshing(false);
    };

    // Fetch shuttle data
    const fetchShuttle = async () => {
        const shuttleRes = await runAxiosAsync<GetShuttleRes>(
            authClient.get("/shuttle/get-shuttle-by-driver")
        );

        if (shuttleRes?.shuttle) {
            setShuttle(shuttleRes.shuttle);
        }
    };

    // Pull-to-refresh handler
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [shuttle]);

    // Initial data fetch
    useEffect(() => {
        fetchShuttle();
    }, []);

    // Fetch trips when shuttle is available
    useEffect(() => {
        if (shuttle) {
            fetchData();
        }
    }, [shuttle]);

    // console.log(trips);

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
                {/* Welcome header with user's first name */}
                <Header>
                    Welcome{" "}
                    {firstName
                        ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
                        : ""}
                    !
                </Header>

                {/* Loading indicator while data is being fetched */}
                {pending && (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                )}

                {!pending && trips.length > 0 && (
                    <UpcomingTripsList trips={trips} title="Upcoming Trips" />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

// Component styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    loading: {
        marginTop: 200,
    },
});
