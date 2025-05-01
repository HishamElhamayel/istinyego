// Import UI components
import Dashboard from "@components/Dashboard";
import UpcomingTripsList from "@components/lists/UpcomingTripsList";
import { useFocusEffect } from "@react-navigation/native";
import DatePicker from "@UI/form/DatePicker";
import Header from "@UI/ui/Header"; // Header component for the screen

// Import utilities and hooks
import colors from "@utils/colors"; // Color constants for styling
import runAxiosAsync from "app/API/runAxiosAsync"; // Utility function for making API calls
import useAuth from "app/hooks/useAuth"; // Custom hook for authentication state
import useClient from "app/hooks/useClient"; // Custom hook for API client
import { DateTime } from "luxon";
import React from "react";

// Import React and React Native components
import { FC, useCallback, useState } from "react";
import {
    ActivityIndicator, // Loading spinner component
    RefreshControl, // Pull-to-refresh functionality
    ScrollView, // Scrollable container
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Safe area wrapper for iOS

// Interface definitions for API response types
interface GetDashboardRes {
    trips: {
        _id: string;
        startLocation: string;
        endLocation: string;
        startTime: string;
        endTime: string;
        state: string;
    }[];
    tripsLeft: number;
    bookings: number;
    income: number;
}

interface Props {}
const Home: FC<Props> = () => {
    // Get authentication state and client
    const { authState } = useAuth();
    const { authClient } = useClient();
    const profile = authState.profile;
    const firstName = profile?.firstName;

    // State management for loading and data
    const [refreshing, setRefreshing] = useState(false);
    const [pending, setPending] = useState(true);
    const [trips, setTrips] = useState<GetDashboardRes["trips"]>([]);
    const [tripsLeft, setTripsLeft] = useState<GetDashboardRes["tripsLeft"]>(0);
    const [bookings, setBookings] = useState<GetDashboardRes["bookings"]>(0);
    const [income, setIncome] = useState<GetDashboardRes["income"]>(0);
    const [date, setDate] = useState<Date>(new Date());

    // Function to fetch all necessary data (bookings, wallet balance, and favorite routes)
    const fetchData = async () => {
        // Fetch user bookings
        const res = await runAxiosAsync<GetDashboardRes>(
            authClient.get("/admin/dashboard", {
                params: {
                    date: DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"),
                },
            })
        );

        setTrips(res?.trips || []);
        setTripsLeft(res?.tripsLeft || 0);
        setBookings(res?.bookings || 0);
        setIncome(res?.income || 0);

        setPending(false);
        setRefreshing(false);
    };

    // Pull-to-refresh handler
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    // Initial data fetch on component mount
    useFocusEffect(
        useCallback(() => {
            setPending(true);
            fetchData();
        }, [date])
    );
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
                <Header>
                    Welcome{" "}
                    {firstName
                        ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
                        : ""}
                    !
                </Header>
                <DatePicker date={date} setParentDate={setDate} />

                {pending ? (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                ) : (
                    <>
                        <Dashboard
                            trips={tripsLeft}
                            bookings={bookings}
                            income={income}
                        />
                        <UpcomingTripsList trips={trips} title="All Trips" />
                    </>
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
