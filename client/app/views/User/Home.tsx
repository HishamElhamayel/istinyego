import RoutesList from "@components/RoutesList";
import TripsList from "@components/TripsList";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import useClient from "app/hooks/useClient";
import Header from "app/UI/Header";
import { FC, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
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
    const { authState } = useAuth();
    const { authClient } = useClient();
    const profile = authState.profile;
    const firstName = profile?.firstName;
    const [pending, setPending] = useState(true);

    const [favoriteRoutes, setFavoriteRoutes] = useState<
        GetFavoriteRes["routes"]
    >([]);
    const [bookings, setBookings] = useState<GetBookingsRes["bookings"]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await runAxiosAsync<GetBookingsRes>(
                authClient.get("/booking/bookings-by-userId")
            );
            if (res?.bookings) {
                setBookings(res.bookings);
            }

            if (profile?.favoriteRoutes) {
                const res = await runAxiosAsync<GetFavoriteRes>(
                    authClient.get("/route/get-fav-routes")
                );
                if (res?.routes) {
                    setFavoriteRoutes(res.routes);
                }
            }

            setPending(false);
        };
        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ overflow: "visible" }}>
                <Header>
                    Welcome{" "}
                    {firstName
                        ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
                        : ""}
                    !
                </Header>
                {pending && (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loadingScreen}
                    />
                )}

                {!pending && bookings.length > 0 && (
                    <TripsList trips={bookings} title="Your Trips" />
                )}
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
    loadingScreen: {
        flex: 1,
        marginTop: 200,
    },
});
