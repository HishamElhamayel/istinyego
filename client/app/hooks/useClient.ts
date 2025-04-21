import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { baseURL } from "../API/client";
import { updateAuthState } from "../store/auth";
import useAuth from "./useAuth";

const authClient = axios.create({ baseURL });

const useClient = () => {
    const { authState } = useAuth();
    const dispatch = useDispatch();

    const token = authState.profile?.token;

    authClient.interceptors.request.use(
        (config) => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = "Bearer " + token;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    authClient.interceptors.response.use(
        (response) => {
            if (response.data?.logout === true) {
                AsyncStorage.removeItem("access-token");
                dispatch(updateAuthState({ profile: null, pending: false }));
            }
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return { authClient };
};

export default useClient;
