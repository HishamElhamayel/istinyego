import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "app/API/client";
import runAxiosAsync from "app/API/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import { Profile, updateAuthState } from "app/store/auth";
import LoadingAnimation from "app/UI/LoadingAnimation";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

const myTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "white",
    },
};

interface Props {}

const Navigator: FC = () => {
    const { authState, loggedIn } = useAuth();
    const dispatch = useDispatch();

    const fetchAuthState = async () => {
        // await AsyncStorage.removeItem("access-token");
        const token = await AsyncStorage.getItem("access-token");
        if (token) {
            dispatch(updateAuthState({ profile: null, pending: true }));
            const res = await runAxiosAsync<{ profile: Profile }>(
                client.get("/auth/is-auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            );

            if (res) {
                dispatch(
                    updateAuthState({ profile: res.profile, pending: false })
                );
            } else {
                dispatch(updateAuthState({ profile: null, pending: false }));
            }
        }
    };

    useEffect(() => {
        fetchAuthState();
    }, []);

    return (
        <NavigationContainer theme={myTheme}>
            <LoadingAnimation visible={authState.pending} />
            {!loggedIn ? <AuthNavigator /> : null}
            {loggedIn ? <TabNavigator /> : null}
        </NavigationContainer>
    );
};

export default Navigator;
