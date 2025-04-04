import TransactionCard from "@UI/cards/TransactionCard";
import RoutLocations from "@UI/RoutLocations";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {};

interface GetTransactionsRes {
    transactions: {
        _id: string; // Transaction ID
        amount: number; // Transaction amount
        type: "add" | "deduct" | "refund"; // Transaction type
        createdAt: string; // Transaction creation date
        route: {
            startLocation: string; // Start location of the route
            endLocation: string; // End location of the route
        };
    }[];
}

const TransactionList = () => {
    const { authClient } = useClient(); // Custom hook to get authenticated client
    const [transactions, setTransactions] = useState<
        GetTransactionsRes["transactions"]
    >([]);
    const [pending, setPending] = useState(true); // State to track loading status

    const fetchData = async () => {
        const TransactionRes = await runAxiosAsync<GetTransactionsRes>(
            authClient.get("/transaction/get-transactions") // API call to get transactions
        );
        if (TransactionRes) {
            setTransactions(TransactionRes.transactions); // Update transactions state
        }
        setPending(false); // Stop loading indicator
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.historyContainer}>
            <Text style={{ fontSize: 20 }}>History</Text>

            {pending ? (
                <ActivityIndicator size="large" color={colors.primary100} />
            ) : transactions.length === 0 ? (
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
                        {transaction.type === "deduct" && (
                            <RoutLocations
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
