import TripsList from "@components/Lists/TripsList";
import { RouteProp, useRoute } from "@react-navigation/native";
import DatePicker from "@UI/DatePicker";
import RouteLocations from "@UI/RouteLocations";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { UserStackParamList } from "app/navigator/UserNavigator";
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

interface GetTripsRes {
    trips: {
        _id: string;
        startTime: string;
        endTime: string;
        availableSeats: number;
        state: string;
    }[];
}
const Home: FC<Props> = () => {
    const route = useRoute<RouteProp<UserStackParamList, "Trips">>();
    const { authClient } = useClient();
    const [refreshing, setRefreshing] = useState(false);
    const [pending, setPending] = useState(true);
    const [trips, setTrips] = useState<GetTripsRes["trips"]>([]);
    const { routeId, startLocation, endLocation } = route.params;
    const [date, setDate] = useState<Date>(new Date());

    const values = {
        routeId,
        date: DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"),
    };

    const fetchData = async () => {
        // Fetch user bookings
        setTrips([]);
        setPending(true); // Stop loading indicator

        const res = await runAxiosAsync<GetTripsRes>(
            authClient.get("/trip/trips-by-route", { params: values })
        );
        if (res?.trips) {
            setTrips(res.trips);
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
    }, [date]);

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
                {/* Show loading indicator while data is being fetched */}

                <RouteLocations from={startLocation} to={endLocation} />
                <View style={{ marginTop: 20, gap: 20 }}>
                    <DatePicker date={date} setParentDate={setDate} />
                    {pending && (
                        <ActivityIndicator
                            size="large"
                            color={colors.primary100}
                            style={styles.loading}
                        />
                    )}

                    {trips.length > 0 && <TripsList trips={trips} />}
                    {!pending && trips.length === 0 && (
                        <Text style={styles.noTrips}>No trips found</Text>
                    )}
                </View>
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
    noTrips: {
        textAlign: "center",
        fontSize: 20,
        color: colors.grey,
    },
});
