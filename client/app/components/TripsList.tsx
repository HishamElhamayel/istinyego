import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RoutLocations from "@UI/RoutLocations";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
    trips: {
        _id: string;
        startLocation: string;
        endLocation: string;
        startTime: string;
        endTime: string;
        tripId: string;
    }[];
    title: string;
};

const TripsList = ({ trips, title }: Props) => {
    const onPress = () => {
        console.log("onPress");
    };

    return (
        <Card title={title} style={styles.container}>
            {trips.map((trip) => (
                <LightCard key={trip._id} onPressHandler={onPress}>
                    <RoutLocations
                        from={trip.startLocation}
                        to={trip.endLocation}
                    />
                    <Text style={styles.dateText}>
                        {DateTime.fromISO(trip.startTime).toFormat("cccc t")}
                    </Text>
                </LightCard>
            ))}
        </Card>
    );
};

export default TripsList;

const styles = StyleSheet.create({
    container: { gap: 15 },
    dateText: {
        fontSize: 22,
    },
});
