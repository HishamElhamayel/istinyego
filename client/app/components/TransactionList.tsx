import TransactionCard from "@UI/cards/TransactionCard";
import RouteLocations from "@UI/RouteLocations";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    transactions: {
        _id: string; // Transaction ID
        amount: number; // Transaction amount
        type: "add" | "deduct" | "refund"; // Transaction type
        createdAt: string; // Transaction creation date
        route?: {
            startLocation: string; // Start location of the route
            endLocation: string; // End location of the route
        };
    }[];
};

const TransactionList: FC<Props> = ({ transactions }) => {
    // Fetch data on component mount

    return (
        <View style={styles.historyContainer}>
            <Text style={{ fontSize: 20 }}>History</Text>

            {transactions.length === 0 ? (
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                    No transactions found
                </Text>
            ) : (
                transactions.map((transaction) => (
                    <TransactionCard
                        key={transaction._id}
                        type={transaction.type}
                        date={transaction.createdAt}
                        amount={transaction.amount}
                    >
                        {transaction.type === "deduct" && transaction.route && (
                            <RouteLocations
                                from={transaction.route.startLocation}
                                to={transaction.route.endLocation}
                            />
                        )}
                    </TransactionCard>
                ))
            )}
        </View>
    );
};

export default TransactionList;

const styles = StyleSheet.create({
    historyContainer: {
        gap: 10,
        marginTop: 20,
    },
});
