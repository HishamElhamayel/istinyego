import { NavigationProp, useNavigation } from "@react-navigation/native";
import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import { getEtc } from "@utils/functions";
import { UserStackParamList } from "app/navigator/UserNavigator";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    trips: {
        _id: string;
        startTime: string;
        endTime: string;
        availableSeats: number;
        state: string;
    }[];
};

const TripsList = ({ trips }: Props) => {
    const navigation = useNavigation<NavigationProp<UserStackParamList>>();

    const onPress = (tripId: string) => {
        navigation.navigate("Trip", {
            tripId,
        });
    };

    return (
        <Card style={styles.root}>
            {trips.map((trip) => (
                <LightCard
                    key={trip._id}
                    onPressHandler={() => onPress(trip._id)}
                >
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.mainText}>
                                {DateTime.fromISO(
                                    trip.startTime
                                ).toLocaleString(DateTime.TIME_24_SIMPLE)}
                            </Text>
                            <Text style={styles.subText}>
                                ETC: {getEtc(trip.startTime, trip.endTime)} min
                            </Text>
                        </View>
                        <View style={styles.seatsContainer}>
                            <Text style={styles.mainText}>
                                {trip.availableSeats}
                            </Text>
                            <Text style={styles.subText}>Seats Available</Text>
                        </View>
                    </View>
                </LightCard>
            ))}
        </Card>
    );
};

export default TripsList;

const styles = StyleSheet.create({
    root: {
        gap: 15,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    mainText: {
        fontSize: 24,
    },
    subText: {
        fontSize: 16,
        color: "#413F42",
    },
    seatsContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});
