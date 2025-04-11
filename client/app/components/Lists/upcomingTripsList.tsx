import { NavigationProp, useNavigation } from "@react-navigation/native";
import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RouteLocations from "@UI/RouteLocations";
import { UserStackParamList } from "app/navigator/UserNavigator";
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
    const navigation = useNavigation<NavigationProp<UserStackParamList>>();

    const onPress = (tripId: string) => {
        navigation.navigate("Trip", { tripId });
    };

    return (
        <Card title={title} style={styles.container}>
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
});
