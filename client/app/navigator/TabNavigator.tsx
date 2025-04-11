import Ionicons from "@expo/vector-icons/Ionicons";
import {
    BottomTabNavigationOptions,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import colors from "@utils/colors";
import useAuth from "app/hooks/useAuth";
import { DriverHomeNavigator } from "./DriverNavigator";
import {
    UserHomeNavigator,
    UserProfileNavigator,
    UserRoutesNavigator,
    UserWalletNavigator,
} from "./UserNavigator";

export type TabParamList = {
    UserHome: undefined;
    UserRoutes: undefined;
    UserProfile: undefined;
    UserWallet: undefined;
    DriverHome: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const getOptions = (
    title: string,
    iconName: string
): BottomTabNavigationOptions => {
    return {
        title,
        tabBarIcon({ color, size }) {
            return (
                <Ionicons name={iconName as any} color={color} size={size} />
            );
        },
        tabBarActiveTintColor: colors.primary100,
    };
};

const UserTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false, animation: "shift" }}
        >
            <Tab.Screen
                name="UserHome"
                component={UserHomeNavigator}
                options={getOptions("Home", "home-sharp")}
            />
            <Tab.Screen
                name="UserWallet"
                component={UserWalletNavigator}
                options={getOptions("Wallet", "wallet-sharp")}
            />
            <Tab.Screen
                name="UserRoutes"
                component={UserRoutesNavigator}
                options={getOptions("Routes", "map-sharp")}
            />
            <Tab.Screen
                name="UserProfile"
                component={UserProfileNavigator}
                options={getOptions("Profile", "person-sharp")}
            />
        </Tab.Navigator>
    );
};

const DriverTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false, animation: "shift" }}
        >
            <Tab.Screen
                name="DriverHome"
                component={DriverHomeNavigator}
                options={getOptions("Home", "home-sharp")}
            />
            <Tab.Screen
                name="UserProfile"
                component={UserProfileNavigator}
                options={getOptions("Profile", "person-sharp")}
            />
        </Tab.Navigator>
    );
};

const TabNavigator = () => {
    const { authState } = useAuth();
    return authState.profile && authState.profile.role === "user" ? (
        <UserTabs />
    ) : authState.profile && authState.profile.role === "driver" ? (
        <DriverTabs />
    ) : authState.profile && authState.profile.role === "admin" ? (
        <DriverTabs />
    ) : null;
};

export default TabNavigator;
