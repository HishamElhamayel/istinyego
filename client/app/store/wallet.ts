import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface Transaction {
    _id: string;
    amount: number;
    type: "add" | "deduct" | "refund";
    createdAt: string;
    balanceAfterTransaction?: number;
    route?: {
        startLocation: string;
        endLocation: string;
    };
}

interface WalletState {
    _id: string;
    balance: number;
    transactions: Transaction[];
    pending: boolean;
}

const initialState: WalletState = {
    _id: "",
    balance: 0,
    transactions: [],
    pending: false,
};

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setId(state, { payload }: PayloadAction<string>) {
            state._id = payload;
        },
        setBalance(state, { payload }: PayloadAction<number>) {
            state.balance = payload;
        },
        setTransactions(state, { payload }: PayloadAction<Transaction[]>) {
            state.transactions = payload;
        },
        addTransaction(state, { payload }: PayloadAction<Transaction>) {
            state.transactions = [payload, ...state.transactions];
            if (payload.balanceAfterTransaction !== undefined) {
                state.balance = payload.balanceAfterTransaction;
            }
        },
        setPending(state, { payload }: PayloadAction<boolean>) {
            state.pending = payload;
        },
    },
});

export const {
    setBalance,
    setTransactions,
    addTransaction,
    setPending,
    setId,
} = walletSlice.actions;

export const getWalletState = createSelector(
    (state: RootState) => state,
    (state) => state.wallet
);

export default walletSlice.reducer;
