import Booking from "#/models/booking.model";
import Transaction from "#/models/transaction.model";
import Trips from "#/models/trip.model";
import { RequestHandler } from "express";
import { DateTime } from "luxon";

export const getAdminDashboard: RequestHandler = async (req, res) => {
    try {
        const formattedDate = req.query.date as string;
        const date = DateTime.fromFormat(formattedDate, "yyyy-MM-dd");

        const trips = await Trips.aggregate([
            {
                $match: {
                    date: formattedDate,
                    // state: "scheduled",
                },
            },
            {
                $lookup: {
                    from: "routes",
                    localField: "route",
                    foreignField: "_id",
                    as: "route",
                },
            },
            {
                $unwind: "$route",
            },
            {
                $project: {
                    _id: 1,
                    startLocation: "$route.startLocation.description",
                    endLocation: "$route.endLocation.description",
                    startTime: 1,
                    endTime: 1,
                    state: 1,
                },
            },
        ]);

        const tripsLeft = await Trips.countDocuments({
            state: "scheduled",
            date: formattedDate,
        });

        const bookings = await Booking.countDocuments({
            createdAt: {
                $gte: date.toJSDate(),
                $lt: date.plus({ days: 1 }).toJSDate(),
            },
        });

        const transaction = await Transaction.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: date.toJSDate(),
                        $lt: date.plus({ days: 1 }).toJSDate(),
                    },
                    type: "add",
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        res.status(200).json({
            trips,
            tripsLeft,
            bookings,
            income: transaction[0]?.totalAmount ?? 0,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
