import { getAuthState } from "app/store/auth";
import { useSelector } from "react-redux";

const useAuth = () => {
    const authState = useSelector(getAuthState);
    const loggedIn = authState.profile ? true : false;

    return { authState, loggedIn };
};

export default useAuth;
