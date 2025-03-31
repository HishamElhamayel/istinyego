import Card from "@UI/cards/Card";
import LightCard from "@UI/cards/LightCard";
import RoutLocations from "@UI/RoutLocations";
import client from "app/API/client";
import runAxiosAsync from "app/API/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import Header from "app/UI/Header";
import { FC, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GetBookingsRes {
    bookings: object[];
}

interface Props {}
const Home: FC<Props> = () => {
    const { authState } = useAuth();
    const firstName = authState.profile?.firstName;

    const [bookings, setBookings] = useState<object[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const res = await runAxiosAsync<GetBookingsRes>(
                client.get("/bookings")
            );
            if (res?.bookings) {
                setBookings(res.bookings);
            }
        };
        fetchBookings();
    }, []);

    const onPress = () => {
        console.log("onPress");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ overflow: "visible" }}>
                <Header>
                    Welcome{" "}
                    {firstName
                        ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
                        : ""}
                    !
                </Header>
                <Card title="Bookings" style={styles.bookings}>
                    <LightCard onPressHandler={onPress}>
                        <RoutLocations from="ISU ANK" to="Seyrantepe" />
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                    <LightCard>
                        <RoutLocations from="ISU ANK" to="Seyrantepe" />

                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                </Card>
                <Card title="Favorite Routes" style={styles.bookings}>
                    <LightCard onPressHandler={onPress}>
                        <RoutLocations from="ISU ANK" to="Seyrantepe" />
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                    <LightCard onPressHandler={onPress}>
                        <RoutLocations from="ISU ANK" to="Seyrantepe" />
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                    <LightCard onPressHandler={onPress}>
                        <RoutLocations from="ISU ANK" to="Seyrantepe" />
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                    <LightCard onPressHandler={onPress}>
                        <RoutLocations from="ISU ANK" to="Seyrantepe" />
                        <Text style={styles.dateText}>Monday 12:00</Text>
                    </LightCard>
                </Card>
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
    bookings: { gap: 15 },
    locationsContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    locationText: {
        fontSize: 24,
    },
    dateText: {
        fontSize: 22,
    },
});
