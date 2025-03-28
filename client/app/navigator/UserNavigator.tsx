import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@views/User/Home";
import Profile from "@views/User/Profile";
import Routes from "@views/User/Routes";
import Wallet from "@views/User/Wallet";
import { FC } from "react";

export type AuthStackParamList = {
    Home: undefined;
    Routes: undefined;
    Profile: undefined;
    Wallet: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

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
        </Stack.Navigator>
    );
};
