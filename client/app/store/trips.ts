import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface Trip {
    _id: string;
    startTime: string;
    endTime: string;
    date: string;
    startLocation: string;
    endLocation: string;
    shuttle: {
        _id: string;
        number: number;
    };
    availableSeats: number;
    state: string;
    fare: number;
}

interface TripsState {
    trips: Trip[];
    pending: boolean;
}

const initialState: TripsState = {
    trips: [],
    pending: false,
};

const tripsSlice = createSlice({
    name: "trips",
    initialState,
    reducers: {
        setTrips(state, { payload }: PayloadAction<Trip[]>) {
            state.trips = payload;
        },
        setPending(state, { payload }: PayloadAction<boolean>) {
            state.pending = payload;
        },
        setTrip(state, { payload }: PayloadAction<Trip>) {
            state.trips = state.trips.map((trip) =>
                trip._id === payload._id ? payload : trip
            );
        },
    },
});

export const { setTrips, setPending, setTrip } = tripsSlice.actions;

export const getTripsState = createSelector(
    (state: RootState) => state,
    (state) => state.trips
);

export default tripsSlice.reducer;
