import RoutesList from "@components/RoutesList";
import TripsList from "@components/TripsList";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import useClient from "app/hooks/useClient";
import Header from "app/UI/Header";
import { FC, useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

interface Props {}
const Home: FC<Props> = () => {
    const { authState } = useAuth(); // Access authentication state
    const { authClient } = useClient(); // Access authenticated Axios client
    const profile = authState.profile; // Extract user profile
    const firstName = profile?.firstName; // Extract user's first name
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
    const [pending, setPending] = useState(true); // State to track loading
    const [favoriteRoutes, setFavoriteRoutes] = useState<
        GetFavoriteRes["routes"]
    >([]); // State for favorite routes
    const [bookings, setBookings] = useState<GetBookingsRes["bookings"]>([]); // State for user bookings

    // Function to fetch data for bookings and favorite routes
    const fetchData = async () => {
        // Fetch user bookings
        const res = await runAxiosAsync<GetBookingsRes>(
            authClient.get("/booking/bookings-by-userId")
        );
        if (res?.bookings) {
            setBookings(res.bookings);
        }

        // Fetch favorite routes if available in the profile
        if (profile?.favoriteRoutes) {
            const res = await runAxiosAsync<GetFavoriteRes>(
                authClient.get("/route/get-fav-routes")
            );
            if (res?.routes) {
                setFavoriteRoutes(res.routes);
            }
        }

        setPending(false); // Stop loading indicator
        setRefreshing(false); // Stop pull-to-refresh indicator
    };

    // Function to handle pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true); // Start pull-to-refresh indicator
        fetchData(); // Fetch data
    }, []);

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={{ overflow: "visible" }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // Show refresh indicator while loading
                        onRefresh={onRefresh} // Trigger refresh on pull
                    />
                }
            >
                {/* Header with a welcome message */}
                <Header>
                    Welcome{" "}
                    {firstName
                        ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
                        : ""}
                    !
                </Header>

                {/* Show loading indicator while data is being fetched */}
                {pending && (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                )}

                {/* Show trips list if bookings are available */}
                {!pending && bookings.length > 0 && (
                    <TripsList trips={bookings} title="Your Trips" />
                )}

                {/* Show favorite routes if available */}
                {!pending && favoriteRoutes.length > 0 && (
                    <RoutesList
                        routes={favoriteRoutes}
                        title="Favorite Routes"
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    loading: {
        marginTop: 200,
    },
});
