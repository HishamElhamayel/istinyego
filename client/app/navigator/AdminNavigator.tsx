import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddCoordinates from "@views/Admin/AddCoordinates";
import CreateDriver from "@views/Admin/CreateDriver";
import CreateShuttle from "@views/Admin/CreateShuttle";
import CreateTrip from "@views/Admin/CreateTrip";
import Drivers from "@views/Admin/Drivers";
import Home from "@views/Admin/Home";
import Route from "@views/Admin/Route";
import Shuttle, { GetShuttleRes } from "@views/Admin/Shuttle";
import Shuttles from "@views/Admin/Shuttles";
import Trip from "@views/Admin/Trip";
import User from "@views/Admin/User";
import Bookings from "@views/Common/Bookings";
import Routes from "@views/Common/Routes";
import TrackShuttle from "@views/Common/TrackShuttle";
import { FC } from "react";

export type AdminStackParamList = {
    Home: undefined;
    Routes: undefined;
    Route: {
        _id?: string;
    };
    AddCoordinates: {
        location?: number[];
        setCoordinates?: (location: number[], address: string) => void;
    };
    Drivers: undefined;
    User: {
        _id: string;
    };
    CreateDriver: undefined;
    Shuttles: undefined;
    CreateShuttle: {
        shuttle?: GetShuttleRes["shuttle"];
    };
    Shuttle: {
        shuttleId: string;
    };
    CreateTrip: {
        shuttleId: string;
        date: string;
        availableSeats: number;
    };
    Trip: {
        tripId: string;
    };
    Bookings: {
        tripId: string;
        startLocation: string;
        endLocation: string;
    };
    TrackShuttle: {
        shuttleId: string;
    };
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

interface Props {}

export const AdminHomeNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Trip" component={Trip} />
            <Stack.Screen name="Bookings" component={Bookings} />
            <Stack.Screen name="TrackShuttle" component={TrackShuttle} />
        </Stack.Navigator>
    );
};

export const AdminRoutesNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Routes" component={Routes} />
            <Stack.Screen name="Route" component={Route} />
            <Stack.Screen
                name="AddCoordinates"
                component={AddCoordinates}
                options={{
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    );
};

export const AdminDriversNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drivers" component={Drivers} />
            <Stack.Screen name="User" component={User} />
            <Stack.Screen name="CreateDriver" component={CreateDriver} />
        </Stack.Navigator>
    );
};
export const AdminShuttlesNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Shuttles" component={Shuttles} />
            <Stack.Screen name="Shuttle" component={Shuttle} />
            <Stack.Screen name="CreateShuttle" component={CreateShuttle} />
            <Stack.Screen name="CreateTrip" component={CreateTrip} />
            <Stack.Screen name="Trip" component={Trip} />
            <Stack.Screen name="Bookings" component={Bookings} />
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
