import axios from "axios";
import { baseURL } from "../API/client";
import useAuth from "./useAuth";

const authClient = axios.create({ baseURL });

const useClient = () => {
    const { authState } = useAuth();

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

    return { authClient };
};

export default useClient;
