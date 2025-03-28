import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface Profile {
    id: string;
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    favoriteRoutes: string[];
    wallet: string;
}

interface AuthState {
    profile: null | Profile;
    pending: boolean;
}

const initialState: AuthState = {
    profile: null,
    pending: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateAuthState(state, { payload }: PayloadAction<AuthState>) {
            state.profile = payload.profile;
            state.pending = payload.pending;
        },
    },
});
export const { updateAuthState } = authSlice.actions;

export const getAuthState = createSelector(
    (state: RootState) => state,
    (state) => state.auth
);

export default authSlice.reducer;
