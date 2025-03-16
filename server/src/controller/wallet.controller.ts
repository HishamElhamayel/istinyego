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
        const wallet = await Wallet.findOne({ _id: user.wallet });

        if (!wallet) {
            res.status(400).json({ error: "Wallet not found" });
            return;
        }

        const amount = req.body.amount;
        wallet.addFunds(amount);

        const transaction = await Transaction.create({
            wallet: wallet._id,
            type: "add",
            amount,
            balanceAfterTransaction: wallet.balance,
        });

        res.json({
            transaction: {
                id: transaction._id,
                // wallet: transaction.wallet,
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
