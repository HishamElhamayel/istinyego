import Transaction from "#/models/transaction.model";
import Wallet from "#/models/wallet.model";
import { RequestHandler } from "express";

export const getWalletBalance: RequestHandler = async (req, res) => {
    try {
        const user = req.user;

        const wallet = await Wallet.findOne({ _id: user.wallet });

        if (!wallet) {
            res.status(400).json({ error: "Wallet not found" });
            return;
        }

        res.json({ balance: wallet?.balance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const chargeWallet: RequestHandler = async (req, res) => {
    try {
        const user = req.user;
        const amount = req.body.amount;

        console.log(amount);

        const wallet = await Wallet.findOne({ _id: user.wallet });

        if (!wallet) {
            res.status(400).json({ error: "Wallet not found" });
            return;
        }

        wallet.addFunds(amount);

        const transaction = await Transaction.create({
            wallet: wallet._id,
            type: "add",
            amount,
            balanceAfterTransaction: wallet.balance,
        });

        res.status(201).json({
            transaction: {
                _id: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                balanceAfterTransaction: transaction.balanceAfterTransaction,
                createdAt: transaction.createdAt,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
