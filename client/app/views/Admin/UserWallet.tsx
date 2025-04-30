import TransactionList from "@components/lists/TransactionList";
import {
    NavigationProp,
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import BlueButton from "@UI/buttons/BlueButton";
import DarkCard from "@UI/cards/DarkCard";
import Header from "@UI/ui/Header";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { UserStackParamList } from "app/navigator/UserNavigator";
import { FC, useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Interfaces for API response types

export interface GetTransactionsRes {
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
}

const Wallet: FC = () => {
    const { authClient } = useClient(); // Custom hook to get authenticated client
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
    const [transactions, setTransactions] = useState<
        GetTransactionsRes["transactions"]
    >([]); // State for transactions
    const [pending, setPending] = useState(true); // State for loading indicator
    const route = useRoute<RouteProp<UserStackParamList, "UserWallet">>();
    const { _id, balance } = route.params; // Get user ID and initial balance from route params

    // Function to fetch wallet balance and transactions
    const fetchData = async () => {
        setPending(true);

        const res = await runAxiosAsync<GetTransactionsRes>(
            authClient.get(`/transaction/${_id}`) // API call to get transactions
        );
        if (res?.transactions) {
            setTransactions(res.transactions);
        }

        setPending(false);
        setRefreshing(false);
    };

    // Function to handle pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
            <ScrollView
                style={{ overflow: "visible" }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Header>Wallet</Header>
                <View style={styles.balanceContainer}>
                    <DarkCard title="Balance">{balance?.toFixed(2)}₺</DarkCard>
                </View>
                {pending ? (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary100}
                        style={styles.loading}
                    />
                ) : (
                    <TransactionList transactions={transactions} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Wallet;

// Styles for the Wallet component
const styles = StyleSheet.create({
    container: { flex: 1, margin: 10 }, // Main container style
    balanceText: {
        fontSize: 38, // Font size for wallet balance text
        color: "white", // Text color
    },
    balanceContainer: {
        gap: 15, // Space between elements in the balance container
    },
    loading: {
        marginTop: 200, // Margin for loading indicator
    },
});
