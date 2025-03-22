import Transaction from "#/models/transaction.model";
import { RequestHandler } from "express";

export const getTransactionsByWalletId: RequestHandler = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            wallet: req.user.wallet,
        });

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
