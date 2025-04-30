import { createNativeStackNavigator } from "@react-navigation/native-stack";
import User from "@views/Admin/User";
import Users from "@views/Admin/Users";
import UserWallet from "@views/Admin/UserWallet";
import ChangePassword from "@views/Auth/ChangePassword";
import EditAccount from "@views/Common/EditAccount";
import Profile from "@views/Common/Profile";
import Routes from "@views/Common/Routes";
import TrackShuttle from "@views/Common/TrackShuttle";
import AddBalance from "@views/User/AddBalance";
import Home from "@views/User/Home";
import Trip from "@views/User/Trip";
import Trips from "@views/User/Trips";
import Wallet from "@views/User/Wallet";
import useAuth from "app/hooks/useAuth";
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
    Users: undefined;
    User: {
        _id: string;
    };
    UserWallet: {
        _id: string;
        balance: number;
    };
    TrackShuttle: {
        shuttleId: string;
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
            <Stack.Screen name="Trips" component={Trips} />
            <Stack.Screen name="Trip" component={Trip} />
            <Stack.Screen
                name="TrackShuttle"
                component={TrackShuttle}
                options={{
                    headerShown: true,
                }}
            />
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
            <Stack.Screen
                name="TrackShuttle"
                component={TrackShuttle}
                options={{
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    );
};
export const UserProfileNavigator: FC<Props> = () => {
    const { authState } = useAuth();
    const isAdmin = authState.profile?.role === "admin";
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="EditAccount" component={EditAccount} />
            {isAdmin && <Stack.Screen name="Users" component={Users} />}
            {isAdmin && <Stack.Screen name="User" component={User} />}
            {isAdmin && (
                <Stack.Screen name="UserWallet" component={UserWallet} />
            )}
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
