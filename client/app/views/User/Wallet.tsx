import TransactionList from "@components/Lists/TransactionList";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import BlueButton from "@UI/buttons/BlueButton";
import DarkCard from "@UI/cards/DarkCard";
import Header from "@UI/ui/Header";
import colors from "@utils/colors";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { UserStackParamList } from "app/navigator/UserNavigator";
import {
    getWalletState,
    setBalance,
    setPending,
    setTransactions,
} from "app/store/wallet";
import { FC, useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

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
    const navigation = useNavigation<NavigationProp<UserStackParamList>>();
    const dispatch = useDispatch();
    const { balance, transactions, pending } = useSelector(getWalletState);
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

    // Function to fetch wallet balance and transactions
    const fetchData = async () => {
        dispatch(setPending(true));

        const TransactionRes = await runAxiosAsync<GetTransactionsRes>(
            authClient.get("/transaction/get-transactions") // API call to get transactions
        );
        if (TransactionRes) {
            dispatch(setTransactions(TransactionRes.transactions));
        }

        dispatch(setPending(false));
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

    // Navigate to Add Balance screen
    const showAddBalance = () => {
        navigation.navigate("AddBalance");
    };

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
                    <DarkCard>
                        <Text style={styles.balanceText}>
                            Balance: {balance?.toFixed(2)}₺
                        </Text>
                    </DarkCard>
                    <BlueButton onPress={showAddBalance}>
                        Add Balance
                    </BlueButton>
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
