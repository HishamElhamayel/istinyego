import Ionicons from "@expo/vector-icons/Ionicons";
import {
    BottomTabNavigationOptions,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import colors from "@utils/colors";
import useAuth from "app/hooks/useAuth";
import {
    AdminDriversNavigator,
    AdminHomeNavigator,
    AdminRoutesNavigator,
    AdminShuttlesNavigator,
} from "./AdminNavigator";
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
    AdminHome: undefined;
    AdminRoutes: undefined;
    AdminDrivers: undefined;
    AdminShuttles: undefined;
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

const AdminTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false, animation: "shift" }}
        >
            <Tab.Screen
                name="AdminHome"
                component={AdminHomeNavigator}
                options={getOptions("Home", "home-sharp")}
            />
            <Tab.Screen
                name="AdminRoutes"
                component={AdminRoutesNavigator}
                options={getOptions("Routes", "location-sharp")}
            />
            <Tab.Screen
                name="AdminDrivers"
                component={AdminDriversNavigator}
                options={getOptions("Drivers", "people-sharp")}
            />
            <Tab.Screen
                name="AdminShuttles"
                component={AdminShuttlesNavigator}
                options={getOptions("Shuttles", "bus")}
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
        <AdminTabs />
    ) : null;
};

export default TabNavigator;
