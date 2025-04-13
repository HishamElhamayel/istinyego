import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Bookings from "@views/Driver/Bookings";
import Home from "@views/Driver/Home";
import Trip from "@views/Driver/Trip";
import { FC } from "react";

export type DriverStackParamList = {
    Home: undefined;
    Trip: { tripId: string };
    Bookings: { tripId: string; startLocation: string; endLocation: string };
};

const Stack = createNativeStackNavigator<DriverStackParamList>();

interface Props {}

export const DriverHomeNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Trip" component={Trip} />
            <Stack.Screen name="Bookings" component={Bookings} />
        </Stack.Navigator>
    );
};
