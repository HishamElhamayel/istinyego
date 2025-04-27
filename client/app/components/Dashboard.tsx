import Card from "@UI/cards/Card";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    trips: number;
    bookings: number;
    income: number;
};

const Dashboard = ({ trips, bookings, income }: Props) => {
    return (
        <>
            <View>
                <Card title="Dashboard" style={styles.card}>
                    <Text style={styles.title}>Trips left: </Text>
                    <Text style={styles.text}>{trips}</Text>
                </Card>
                <View style={styles.rowContainer}>
                    <Card style={styles.card}>
                        <Text style={styles.title}>Bookings: </Text>
                        <Text style={styles.text}>{bookings}</Text>
                    </Card>
                    <Card style={styles.card}>
                        <Text style={styles.title}>Income: </Text>
                        <Text style={styles.text}>{income}₺</Text>
                    </Card>
                </View>
            </View>
        </>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        width: "100%",
    },
    card: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        minWidth: "48%",
    },
    title: {
        fontSize: 24,
        color: "white",
        // marginBottom: 10,
    },
    text: {
        color: "white",
        fontSize: 32,
        textAlign: "right",
        fontWeight: "600",
    },
});
