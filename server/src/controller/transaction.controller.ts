import Transaction from "#/models/transaction.model";
import { WalletDocument } from "#/models/wallet.model";
import { RequestHandler } from "express";

export const createTransaction: RequestHandler = async (req, res) => {
    try {
        const { amount, type } = req.body;

        await req.user.populate("wallet");
        const wallet = req.user.wallet as WalletDocument;

        if (!wallet) {
            res.status(404).json({ error: "Wallet not found" });
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            res.status(400).json({ error: "Invalid amount" });
            return;
        }

        let balanceAfterTransaction: number;

        if (type === "add") {
            balanceAfterTransaction = await wallet.addFunds(amount);
        } else if (type === "deduct") {
            balanceAfterTransaction = await wallet.deductFunds(amount);
        } else {
            res.status(400).json({ error: "Invalid transaction type" });
            return;
        }

        const transaction = await Transaction.create({
            walletId: wallet._id,
            type,
            amount,
            balanceAfterTransaction,
        });

        // res.json({ okay: "okay" });
        res.status(201).json({
            transaction: {
                id: transaction._id,
                // walletId: transaction.walletId,
                type: transaction.type,
                amount: transaction.amount,
                balanceAfterTransaction: transaction.balanceAfterTransaction,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getTransactionsByWalletId: RequestHandler = async (req, res) => {
    try {
        const user = req.user;
        const walletId = user.wallet;

        const transactions = await Transaction.find({ walletId });

        res.json({ transactions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getAllTransactions: RequestHandler = async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        res.json({ transactions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
