import Transaction from "#/models/transaction.model";
import { RequestHandler } from "express";

export const getTransactionsByWalletId: RequestHandler = async (req, res) => {
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
                $unwind: {
                    path: "$route",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        console.log(transactions);

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
