import TransactionCard from "@UI/cards/TransactionCard";
import RoutLocations from "@UI/RoutLocations";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    transactions: {
        _id: string;
        amount: number;
        type: "add" | "deduct" | "refund";
        createdAt: string;
        route: {
            startLocation: string;
            endLocation: string;
        };
    }[];
};

const TransactionList = ({ transactions }: Props) => {
    console.log(transactions);
    return (
        <View style={styles.historyContainer}>
            <Text style={{ fontSize: 20 }}>History</Text>
            {transactions.map((transaction) => (
                <TransactionCard
                    key={transaction._id}
                    type={transaction.type}
                    date={transaction.createdAt}
                    amount={transaction.amount}
                >
                    {transaction.type === "deduct" && (
                        <RoutLocations
                            from={transaction.route.startLocation}
                            to={transaction.route.endLocation}
                        />
                    )}
                </TransactionCard>
            ))}
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
