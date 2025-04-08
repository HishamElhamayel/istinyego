import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import bookingsReducer from "./bookings";
import walletReducer from "./wallet";

const reducers = combineReducers({
    auth: authReducer,
    wallet: walletReducer,
    bookings: bookingsReducer,
});

const store = configureStore({
    reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
