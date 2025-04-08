import { NavigationProp, useNavigation } from "@react-navigation/native";
import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RouteLocations from "@UI/RouteLocations";
import { UserStackParamList } from "app/navigator/UserNavigator";
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
    const navigation = useNavigation<NavigationProp<UserStackParamList>>();

    const onPress = (tripId: string) => {
        navigation.navigate("Trip", { tripId });
    };
    return (
        <Card title={title} style={styles.container}>
            {bookings.map((booking) => (
                <LightCard
                    key={booking._id}
                    onPressHandler={() => onPress(booking.tripId)}
                >
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
