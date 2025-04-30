// Import UI components
import BookingsList from "@components/lists/BookingsList"; // Component to display list of bookings
import RoutesList from "@components/lists/RoutesList"; // Component to display list of favorite routes
import Header from "@UI/ui/Header"; // Header component for the screen

// Import utilities and hooks
import colors from "@utils/colors"; // Color constants for styling
import runAxiosAsync from "app/API/runAxiosAsync"; // Utility function for making API calls
import useAuth from "app/hooks/useAuth"; // Custom hook for authentication state
import useClient from "app/hooks/useClient"; // Custom hook for API client

// Import Redux related utilities
import { getBookingsState, setBookings } from "app/store/bookings"; // Redux actions and selectors for bookings
import { setBalance } from "app/store/wallet"; // Redux action for updating wallet balance

// Import React and React Native components
import { FC, useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator, // Loading spinner component
    RefreshControl, // Pull-to-refresh functionality
    ScrollView, // Scrollable container
    StyleSheet, // Style creation utility
    Text, // Text component for displaying text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Safe area wrapper for iOS
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for state management

// Interface definitions for API response types
interface GetBookingsRes {
    bookings: {
        _id: string;
        startLocation: string;
        endLocation: string;
        startTime: string;
        endTime: string;
        tripId: string;
    }[];
}
interface GetFavoriteRes {
    routes: {
        _id: string;
        startLocation: string;
        endLocation: string;
    }[];
}
interface GetWalletRes {
    balance: number;
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
    const [favoriteRoutes, setFavoriteRoutes] = useState<
        GetFavoriteRes["routes"]
    >([]);

    // Redux state management
    const dispatch = useDispatch();
    const { bookings } = useSelector(getBookingsState);

    // Function to fetch all necessary data (bookings, wallet balance, and favorite routes)
    const fetchData = async () => {
        // Fetch user bookings
        const res = await runAxiosAsync<GetBookingsRes>(
            authClient.get("/booking/bookings-by-userId")
        );
        if (res?.bookings && res.bookings.length > 0) {
            dispatch(setBookings(res.bookings));
        }

        // Fetch wallet balance
        const walletRes = await runAxiosAsync<GetWalletRes>(
            authClient.get("/wallet/get-balance")
        );
        if (walletRes?.balance) {
            dispatch(setBalance(walletRes.balance));
        }

        // Fetch favorite routes if user has any
        if (profile?.favoriteRoutes && profile.favoriteRoutes.length > 0) {
            const res = await runAxiosAsync<GetFavoriteRes>(
                authClient.get("/route/get-fav-routes")
            );
            if (res?.routes) {
                setFavoriteRoutes(res.routes);
            }
        } else {
            setFavoriteRoutes([]);
        }

        setPending(false);
        setRefreshing(false);
    };

    // Pull-to-refresh handler
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    // Initial data fetch on component mount
    useEffect(() => {
        fetchData();
    }, [authState]);

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

                {/* Display bookings list if available */}
                {!pending && bookings.length > 0 && (
                    <BookingsList bookings={bookings} title="Your Trips" />
                )}

                {/* Display favorite routes if available */}
                {!pending && favoriteRoutes.length > 0 && (
                    <RoutesList
                        routes={favoriteRoutes}
                        title="Favorite Routes"
                    />
                )}
                {!pending && favoriteRoutes.length === 0 && (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>
                        Favorite routes to see them here.
                    </Text>
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
