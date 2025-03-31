import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@utils/colors";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    children?: React.ReactNode;
    type: "add" | "deduct" | "refund";
    date: Date;
    amount: number;
}

const TransactionCard: FC<Props> = ({ type, date, amount, children }) => {
    return (
        <View style={styles.root}>
            <View style={styles.topContainer}>
                <View style={styles.amount}>
                    {type === "deduct" ? (
                        <Ionicons name="remove-sharp" size={22} />
                    ) : (
                        <Ionicons name="add-sharp" size={22} />
                    )}
                    <Text style={styles.amountText}>{amount} TL</Text>
                </View>
                <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </View>
            {children && children}
            {type === "refund" && (
                <Text style={styles.amountText}>
                    Refund due to canceled trip
                </Text>
            )}
        </View>
    );
};

export default TransactionCard;

const styles = StyleSheet.create({
    root: {
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "white",
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    amount: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    amountText: {
        fontSize: 22,
    },
    dateText: {
        fontSize: 16,
        color: colors.grey,
    },
});
