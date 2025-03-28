import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@views/User/Home";
import { FC } from "react";

export type AuthStackParamList = {
    Home: undefined;
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
        </Stack.Navigator>
    );
};
