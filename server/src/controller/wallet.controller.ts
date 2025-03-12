import Wallet from "#/models/wallet.model";
import { RequestHandler } from "express";

export const getWalletBalance: RequestHandler = async (req, res) => {
    try {
        const user = req.user;

        const wallet = await Wallet.findOne({ _id: user.wallet });

        res.json({ balance: wallet?.balance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
