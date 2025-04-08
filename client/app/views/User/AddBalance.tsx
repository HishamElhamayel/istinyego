import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import DateInput from "@UI/form/DateInput";
import KeyboardView from "@UI/KeyboardView";
import colors from "@utils/colors";
import validate, { AddBalanceSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { UserStackParamList } from "app/navigator/UserNavigator";
import { addTransaction } from "app/store/wallet";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import FormInput from "../../UI/form/FormInput";

export interface ChargeWalletRes {
    transaction: {
        _id: string;
        amount: number;
        type: "add" | "deduct" | "refund";
        balanceAfterTransaction: number;
        createdAt: string;
    };
}

const AddBalance: FC = () => {
    const navigation = useNavigation<NavigationProp<UserStackParamList>>();
    const { authClient } = useClient();
    const dispatch = useDispatch();
    const [busy, setBusy] = useState(false);
    const [userInfo, setUserInfo] = React.useState({
        cardNumber: "",
        amount: "",
        cvv: "",
    });
    const [expiryDate, setExpiryDate] = useState<Date>(new Date());

    const { cardNumber, amount, cvv } = userInfo;

    const userData = {
        cardNumber,
        amount,
        cvv,
        expiryDate,
    };

    const handleChange = (key: string) => (text: string) => {
        setUserInfo({ ...userInfo, [key]: text });
    };

    const handleSubmit = async () => {
        const { values, error } = await validate(AddBalanceSchema, userData);
        if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);
        const res = await runAxiosAsync<ChargeWalletRes>(
            authClient.post("/wallet/charge-wallet", { amount: Number(amount) })
        );

        if (res?.transaction) {
            dispatch(addTransaction(res.transaction));
            showMessage({
                message: "Balance added successfully",
                type: "success",
            });
        }

        navigation.goBack();
        setBusy(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["right", "left", "top"]}>
            <LinearGradient
                colors={[colors.primary100, colors.primary50]}
                style={styles.formContainer}
            >
                <Text style={styles.title}>Add Balance</Text>
                <KeyboardView>
                    <View style={styles.form}>
                        <FormInput
                            label="Card Number"
                            value={cardNumber}
                            onChangeText={handleChange("cardNumber")}
                            maxLength={16}
                            keyboardType="numeric"
                        />

                        <FormInput
                            label="Amount"
                            value={amount}
                            onChangeText={handleChange("amount")}
                            keyboardType="numeric"
                            maxLength={5}
                        />

                        <View style={styles.bottomContainer}>
                            <FormInput
                                label="CVV"
                                value={cvv}
                                flex={true}
                                onChangeText={handleChange("cvv")}
                                keyboardType="numeric"
                                maxLength={4}
                            />
                            <DateInput
                                label="Expiry Date"
                                setParentDate={setExpiryDate}
                            />
                        </View>

                        <Button onPress={handleSubmit} active={!busy}>
                            Add Balance
                        </Button>
                        {Platform.OS === "android" && (
                            <Button onPress={() => navigation.goBack()}>
                                Go Back
                            </Button>
                        )}
                    </View>
                </KeyboardView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
        flex: 1,
    },
    form: {
        gap: 15,
        flex: 1,
    },
    title: {
        fontSize: 32,
        textAlign: "center",
        color: "white",
    },
    bottomContainer: {
        gap: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        // flex: 1,
    },
});

export default AddBalance;
