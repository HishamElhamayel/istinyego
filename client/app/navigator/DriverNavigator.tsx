import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@views/Driver/Home";
import Trip from "@views/Driver/Trip";
import { FC } from "react";

export type AuthStackParamList = {
    Home: undefined;
    Trip: { tripId: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

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
        </Stack.Navigator>
    );
};
