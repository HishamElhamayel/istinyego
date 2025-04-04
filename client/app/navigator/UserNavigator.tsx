import AddBalance, { ChargeWalletRes } from "@components/AddBalance";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@views/User/Home";
import Profile from "@views/User/Profile";
import Routes from "@views/User/Routes";
import Wallet, { GetTransactionsRes } from "@views/User/Wallet";
import { FC } from "react";

export type UserStackParamList = {
    Home: undefined;
    Routes: undefined;
    Profile: undefined;
    Wallet: undefined;
    AddBalance: {
        setData: (
            balance: number,
            transactions: ChargeWalletRes["transaction"]
        ) => void;
    };
};

const Stack = createNativeStackNavigator<UserStackParamList>();

interface Props {}

export const UserHomeNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    );
};

export const UserRoutesNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Home" component={Routes} />
        </Stack.Navigator>
    );
};
export const UserProfileNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    );
};
export const UserWalletNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Wallet" component={Wallet} />
            <Stack.Screen
                name="AddBalance"
                component={AddBalance}
                options={{
                    presentation: "formSheet",
                    sheetAllowedDetents: "fitToContents",
                    sheetCornerRadius: 60,
                    sheetGrabberVisible: true,
                }}
            />
        </Stack.Navigator>
    );
};
