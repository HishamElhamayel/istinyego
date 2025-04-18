import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePassword from "@views/Auth/ChangePassword";
import EditAccount from "@views/Common/EditAccount";
import Profile from "@views/Common/Profile";
import Routes from "@views/Common/Routes";
import AddBalance from "@views/User/AddBalance";
import Home from "@views/User/Home";
import Trip from "@views/User/Trip";
import Trips from "@views/User/Trips";
import Wallet from "@views/User/Wallet";
import { FC } from "react";
import { Platform } from "react-native";

export type UserStackParamList = {
    Home: undefined;
    Routes: undefined;
    Profile: undefined;
    Wallet: undefined;
    AddBalance: undefined;
    Trips: { routeId: string; startLocation: string; endLocation: string };
    Trip: { tripId: string };
    ChangePassword: undefined;
    EditAccount: undefined;
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
            <Stack.Screen name="Trips" component={Trips} />
            <Stack.Screen name="Trip" component={Trip} />
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
            <Stack.Screen name="Routes" component={Routes} />
            <Stack.Screen name="Trips" component={Trips} />
            <Stack.Screen name="Trip" component={Trip} />
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
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="EditAccount" component={EditAccount} />
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
                    presentation: Platform.OS === "ios" ? "formSheet" : "card",
                    sheetCornerRadius: 60,
                    sheetAllowedDetents: "fitToContents",
                    sheetGrabberVisible: true,
                }}
            />
        </Stack.Navigator>
    );
};
