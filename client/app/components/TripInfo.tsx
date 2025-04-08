import Card from "@UI/cards/Card";
import DarkCard from "@UI/cards/DarkCard";
import Info from "@UI/info";
import RouteLocations from "@UI/RouteLocations";
import { getEtc } from "@utils/functions";
import { GetTripRes } from "@views/User/Trip";
import { getBookingsState } from "app/store/bookings";
import { getWalletState } from "app/store/wallet";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

type Props = {
    trip: GetTripRes["trip"];
};

const TripInfo = ({ trip }: Props) => {
    const { bookings } = useSelector(getBookingsState);
    const { balance } = useSelector(getWalletState);
    const booking = bookings.find((booking) => booking.tripId === trip._id);

    return (
        <>
            <Info title="Shuttle">
                ISU - {trip.shuttle.number.toString().padStart(2, "0")}
            </Info>
            <Info title="State">
                {trip.state.charAt(0).toUpperCase() + trip.state.slice(1)}
            </Info>

            <View style={styles.rowContainer}>
                <Info title="Starting Time" style={styles.rowItem}>
                    {DateTime.fromISO(trip.startTime).toLocaleString(
                        DateTime.TIME_24_SIMPLE
                    )}
                </Info>
                <Info title="Estimated Time" style={styles.rowItem}>
                    {getEtc(trip.startTime, trip.endTime)} min
                </Info>
            </View>
            <View style={styles.rowContainer}>
                <Info title="Available Seats" style={styles.rowItem}>
                    {trip.availableSeats}
                </Info>
                <Info title="Fare" style={styles.rowItem}>
                    {trip.fare.toFixed(2)} ₺
                </Info>
            </View>
        </>
    );
};

export default TripInfo;

const styles = StyleSheet.create({
    balanceText: {
        fontSize: 38,
        color: "white",
    },
    rowContainer: {
        flexDirection: "row",
    },
    rowItem: {
        flex: 1,
    },
    centerText: {
        textAlign: "center",
        fontSize: 24,
    },
});
