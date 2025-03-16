import Transaction from "#/models/transaction.model";
import Wallet from "#/models/wallet.model";
import { RequestHandler } from "express";

// export const createTransaction: RequestHandler = async (req, res) => {
//     try {
//         const { amount, type } = req.body;

//         const wallet = await Wallet.findById(req.user.wallet);

//         if (!wallet) {
//             res.status(404).json({ error: "Wallet not found" });
//             return;
//         }

//         let balanceAfterTransaction: number = 0;

//         if (type === "add") {
//             balanceAfterTransaction = await wallet.addFunds(amount);
//         } else if (type === "deduct") {
//             balanceAfterTransaction = await wallet.deductFunds(amount);
//         }

//         const transaction = await Transaction.create({
//             wallet: wallet._id,
//             type,
//             amount,
//             balanceAfterTransaction,
//         });

//         // res.json({ okay: "okay" });
//         res.status(201).json({
//             transaction: {
//                 id: transaction._id,
//                 // wallet: transaction.wallet,
//                 type: transaction.type,
//                 amount: transaction.amount,
//                 balanceAfterTransaction: transaction.balanceAfterTransaction,
//             },
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// };

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
