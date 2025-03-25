import { AxiosError, AxiosResponse } from "axios";
import { showMessage } from "react-native-flash-message";

// type SuccessResponse<T> = {
//     data: T;
//     error: null;
// };

// type ErrorResponse<E> = {
//     data: null;
//     error: E;
// };
const runAxiosAsync = async <T>(
    promise: Promise<AxiosResponse<T>>
): Promise<T | null> => {
    try {
        const response = await promise;
        console.log(response.data);
        return response.data;
    } catch (error) {
        let message = (error as any).message;
        if (error instanceof AxiosError) {
            const response = error.response;
            if (response) {
                message = response.data.error;

                // console.log(message);
            }
        }
        showMessage({ message, type: "danger" });
        return null;
    }
};

export default runAxiosAsync;
