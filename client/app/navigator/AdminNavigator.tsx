import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@views/Admin/Home";
import Map from "@views/Admin/Map";
import Route from "@views/Admin/Route";
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
        setCoordinates?: (location: number[]) => void;
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
