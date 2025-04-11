import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import bookingsReducer from "./bookings";
import tripsReducer from "./trips";
import walletReducer from "./wallet";

const reducers = combineReducers({
    auth: authReducer,
    wallet: walletReducer,
    bookings: bookingsReducer,
    trips: tripsReducer,
});

const store = configureStore({
    reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
