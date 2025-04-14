import { NavigationProp, useNavigation } from "@react-navigation/native";
import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RouteLocations from "@UI/ui/RouteLocations";
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
};

const UpcomingTripsList = ({ trips, title }: Props) => {
    const navigation = useNavigation<NavigationProp<DriverStackParamList>>();

    const onPress = (tripId: string) => {
        navigation.navigate("Trip", { tripId });
    };

    return (
        <Card title={title} style={styles.container}>
            {trips.length === 0 && (
                <Text style={styles.noTrips}>No trips found</Text>
            )}
            {trips.map((trip) => (
                <LightCard
                    key={trip._id}
                    onPressHandler={() => onPress(trip._id)}
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
                            {DateTime.fromISO(trip.startTime).toFormat(
                                "cccc t"
                            )}
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
