import { NavigationProp, useNavigation } from "@react-navigation/native";
import Button from "@UI/buttons/Button";
import DateInput from "@UI/form/DateInput";
import colors from "@utils/colors";
import { WalletStackParamList } from "@views/User/Wallet";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import validate, { AddBalanceSchema } from "@utils/validator";
import runAxiosAsync from "app/API/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { showMessage } from "react-native-flash-message";
import FormInput from "../UI/form/FormInput";

interface ChargeWalletRes {
    transaction: {
        _id: string;
        type: string;
        amount: number;
        balanceAfterTransaction: number;
    };
}

const AddBalance: FC = () => {
    const navigation = useNavigation<NavigationProp<WalletStackParamList>>();
    const { authClient } = useClient(); // Access authenticated Axios client

    const [busy, setBusy] = useState(false);
    const [userInfo, setUserInfo] = React.useState({
        cardNumber: "3412345645675678",
        amount: "1222",
        cvv: "2321",
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
        navigation.goBack();

        // if (res?.profile) {
        //     showMessage({ message: "Signed in successful ", type: "success" });
        //     if (res?.token) {
        //         // console.log(res);
        //         await AsyncStorage.setItem("access-token", res.token);
        //         // console.log(await AsyncStorage.getItem("access-token"));
        //         dispatch(
        //             updateAuthState({
        //                 profile: { ...res.profile, token: res.token },
        //                 pending: false,
        //             })
        //         );
        //     }
        // }

        setBusy(false);
    };

    return (
        <LinearGradient
            colors={[colors.primary100, colors.primary50]}
            style={[styles.container]}
        >
            <View style={{ gap: 15 }}>
                <Text style={styles.header}>Add Balance</Text>
                <FormInput
                    label="Amount"
                    onChangeText={handleChange("amount")}
                    value={amount}
                    keyboardType="numeric"
                    maxLength={4}
                    collapsable
                />
                <FormInput
                    label="Card Number"
                    onChangeText={handleChange("cardNumber")}
                    textContentType="creditCardNumber"
                    value={cardNumber}
                    keyboardType="numeric"
                    maxLength={16}
                />

                <View style={{ flexDirection: "row", gap: 15 }}>
                    <DateInput
                        label="Expiry date"
                        setParentDate={setExpiryDate}
                    />
                    <FormInput
                        label="CVV"
                        keyboardType="numeric"
                        value={cvv}
                        onChangeText={handleChange("cvv")}
                        maxLength={4}
                        collapsable
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <Button
                        size="medium"
                        active={!busy}
                        onPress={() => {
                            handleSubmit();
                        }}
                    >
                        Confirm
                    </Button>
                    <Button size="medium" onPress={() => navigation.goBack()}>
                        Cancel
                    </Button>
                </View>
            </View>
        </LinearGradient>
    );
};

export default AddBalance;

const styles = StyleSheet.create({
    container: {
        // borderRadius: 15,
        paddingVertical: 25,
        paddingHorizontal: 15,
        flex: 1,
    },
    header: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        marginBottom: 15,
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "stretch", // Ensure buttons stretch
        gap: 5, // Optional: Add spacing between buttons
        justifyContent: "space-between", // Add spacing between buttons
        width: "100%", // Ensure full width
        marginBottom: 50,
    },
});
