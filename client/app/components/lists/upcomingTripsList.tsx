import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RouteLocations from "@UI/ui/RouteLocations";
import useAuth from "app/hooks/useAuth";
import { DriverStackParamList } from "app/navigator/DriverNavigator";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    trips: {
        _id: string;
        startLocation: string;
        endLocation: string;
        startTime: string;
        endTime: string;
        state: string;
    }[];
    title: string;

    onCreateNew?: () => void;
};

const UpcomingTripsList = ({ trips, title, onCreateNew }: Props) => {
    const navigation = useNavigation<NavigationProp<DriverStackParamList>>();
    const { authState } = useAuth();
    const profile = authState.profile;

    const onPressHandler = (tripId: string) => {
        navigation.navigate("Trip", { tripId });
    };

    return (
        <Card title={title} style={styles.container}>
            {profile?.role === "admin" && onCreateNew && (
                <Button onPress={onCreateNew}> Create a new trip</Button>
            )}
            {trips.map((trip) => (
                <LightCard
                    key={trip._id}
                    onPressHandler={() => onPressHandler(trip._id)}
                >
                    <RouteLocations
                        from={trip.startLocation}
                        to={trip.endLocation}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={styles.text}>
                            {DateTime.fromISO(trip.startTime).toFormat("ccc t")}
                        </Text>
                        <Text
                            style={[
                                styles.text,
                                trip.state === "completed" && styles.completed,
                            ]}
                        >
                            {trip.state === "completed"
                                ? "Completed"
                                : trip.state === "scheduled"
                                ? "Scheduled"
                                : trip.state === "inProgress"
                                ? "In Progress"
                                : "Cancelled"}
                        </Text>
                    </View>
                </LightCard>
            ))}
            {trips.length === 0 && (
                <Text style={styles.noTrips}>No trips found</Text>
            )}
        </Card>
    );
};

export default UpcomingTripsList;

const styles = StyleSheet.create({
    container: { gap: 15 },
    text: {
        fontSize: 22,
    },
    completed: {
        color: "green",
    },
    noTrips: {
        fontSize: 22,
        textAlign: "center",
        color: "white",
    },
});
