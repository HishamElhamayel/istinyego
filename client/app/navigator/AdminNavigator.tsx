import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "@views/Admin/AddCoordinates";
import Drivers from "@views/Admin/Drivers";
import Home from "@views/Admin/Home";
import Route from "@views/Admin/Route";
import User from "@views/Admin/User";
import Routes from "@views/Common/Routes";
import { FC } from "react";

export type AdminStackParamList = {
    Home: undefined;
    Routes: undefined;
    Route: {
        _id?: string;
    };
    Map: {
        location?: number[];
        setCoordinates?: (location: number[], address: string) => void;
    };
    Drivers: undefined;
    User: {
        _id: string;
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
        </Stack.Navigator>
    );
};

export const AdminRoutesNavigator: FC<Props> = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Routes" component={Routes} />
            <Stack.Screen name="Route" component={Route} />
            <Stack.Screen
                name="Map"
                component={Map}
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
        </Stack.Navigator>
    );
};
