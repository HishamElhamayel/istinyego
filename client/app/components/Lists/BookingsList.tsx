import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RouteLocations from "@UI/RouteLocations";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
    bookings: {
        _id: string;
        startLocation: string;
        endLocation: string;
        startTime: string;
        endTime: string;
        tripId: string;
    }[];
    title: string;
};

const BookingsList = ({ bookings, title }: Props) => {
    const onPress = () => {
        console.log("onPress");
    };

    return (
        <Card title={title} style={styles.container}>
            {bookings.map((booking) => (
                <LightCard key={booking._id} onPressHandler={onPress}>
                    <RouteLocations
                        from={booking.startLocation}
                        to={booking.endLocation}
                    />
                    <Text style={styles.dateText}>
                        {DateTime.fromISO(booking.startTime).toFormat("cccc t")}
                    </Text>
                </LightCard>
            ))}
        </Card>
    );
};

export default BookingsList;

const styles = StyleSheet.create({
    container: { gap: 15 },
    dateText: {
        fontSize: 22,
    },
});
