import { AxiosError, AxiosResponse } from "axios";
import { showMessage } from "react-native-flash-message";

const runAxiosAsync = async <T>(
    promise: Promise<AxiosResponse<T>>
): Promise<T | null> => {
    try {
        const response = await promise;
        return { ...response.data, status: response.status };
    } catch (error) {
        let message = (error as any).message;
        if (error instanceof AxiosError) {
            const response = error.response;
            if (response) {
                message = response.data.error;
            }
        }
        showMessage({ message, type: "danger" });
        return null;
    }
};

export default runAxiosAsync;
