import Info from "@UI/ui/Info";
import { getEtc } from "@utils/functions";
import { GetTripRes } from "@views/User/Trip";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
    trip: GetTripRes["trip"];
};

const TripInfo = ({ trip }: Props) => {
    return (
        <>
            <Info title="Shuttle">
                ISU - {trip.shuttle.number.toString().padStart(2, "0")}
            </Info>
            <Info title="State">
                {trip.state === "completed"
                    ? "Completed"
                    : trip.state === "scheduled"
                    ? "Scheduled"
                    : trip.state === "inProgress"
                    ? "In Progress"
                    : "Cancelled"}{" "}
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
    rowContainer: {
        flexDirection: "row",
    },
    rowItem: {
        flex: 1,
    },
});
