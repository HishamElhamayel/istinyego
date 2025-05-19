import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface Booking {
    _id: string;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    tripId: string;
}

interface BookingsState {
    bookings: Booking[];
    pending: boolean;
}

const initialState: BookingsState = {
    bookings: [],
    pending: false,
};

const bookingsSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        setBookings(state, { payload }: PayloadAction<Booking[]>) {
            state.bookings = payload;
        },
        addBooking(state, { payload }: PayloadAction<Booking>) {
            state.bookings = [payload, ...state.bookings];
        },
        setPending(state, { payload }: PayloadAction<boolean>) {
            state.pending = payload;
        },
        resetBookings(state) {
            state.bookings = [];
            state.pending = false;
        },
    },
});

export const { setBookings, addBooking, setPending, resetBookings } =
    bookingsSlice.actions;

export const getBookingsState = createSelector(
    (state: RootState) => state,
    (state) => state.bookings
);

export default bookingsSlice.reducer;
