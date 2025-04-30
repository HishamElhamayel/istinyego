import Transaction from "#/models/transaction.model";
import { RequestHandler } from "express";
import mongoose from "mongoose";

export const getTransactions: RequestHandler = async (req, res) => {
    try {
        const transactions = await Transaction.aggregate([
            {
                $match: {
                    wallet: req.user.wallet,
                },
            },
            {
                $lookup: {
                    from: "bookings",
                    localField: "booking",
                    foreignField: "_id",
                    as: "booking",
                },
            },
            {
                $lookup: {
                    from: "trips",
                    localField: "booking.trip",
                    foreignField: "_id",
                    as: "trip",
                },
            },
            {
                $lookup: {
                    from: "routes",
                    localField: "trip.route",
                    foreignField: "_id",
                    as: "route",
                },
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    amount: 1,
                    balanceAfterTransaction: 1,
                    createdAt: 1,
                    // bookingId: { $arrayElemAt: ["$booking._id", 0] },
                    // tripId: { $arrayElemAt: ["$trip._id", 0] },
                    route: {
                        startLocation: {
                            $arrayElemAt: [
                                "$route.startLocation.description",
                                0,
                            ],
                        },
                        endLocation: {
                            $arrayElemAt: ["$route.endLocation.description", 0],
                        },
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $unwind: {
                    path: "$route",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        res.json({ transactions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getTransactionsByWalletId: RequestHandler = async (req, res) => {
    const { walletId } = req.params;

    if (!walletId) {
        res.status(400).json({ error: "Wallet ID is required" });
        return;
    }

    console.log(walletId);

    try {
        const transactions = await Transaction.aggregate([
            {
                $match: {
                    wallet: new mongoose.Types.ObjectId(walletId),
                },
            },
            {
                $lookup: {
                    from: "bookings",
                    localField: "booking",
                    foreignField: "_id",
                    as: "booking",
                },
            },
            {
                $lookup: {
                    from: "trips",
                    localField: "booking.trip",
                    foreignField: "_id",
                    as: "trip",
                },
            },
            {
                $lookup: {
                    from: "routes",
                    localField: "trip.route",
                    foreignField: "_id",
                    as: "route",
                },
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    amount: 1,
                    balanceAfterTransaction: 1,
                    createdAt: 1,
                    // bookingId: { $arrayElemAt: ["$booking._id", 0] },
                    // tripId: { $arrayElemAt: ["$trip._id", 0] },
                    route: {
                        startLocation: {
                            $arrayElemAt: [
                                "$route.startLocation.description",
                                0,
                            ],
                        },
                        endLocation: {
                            $arrayElemAt: ["$route.endLocation.description", 0],
                        },
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $unwind: {
                    path: "$route",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);
        res.json({ transactions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
