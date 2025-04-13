import Booking from "#/models/booking.model";
import { RouteDocument } from "#/models/route.model";
import Transaction from "#/models/transaction.model";
import Trip from "#/models/trip.model";
import { WalletDocument } from "#/models/wallet.model";
import { RequestHandler } from "express";
import mongoose, { isValidObjectId, startSession } from "mongoose";

export const createBooking: RequestHandler = async (req, res) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const { tripId } = req.body;

        // get user wallet
        await req.user.populate("wallet");
        const wallet = req.user.wallet as unknown as WalletDocument;

        // get trip and route
        const trip = await Trip.findById(tripId)
            .populate<{ route: RouteDocument }>("route")
            .session(session);

        if (!trip) {
            await session.abortTransaction();
            res.status(404).json({ error: "Trip not found" });
            return;
        }

        // ensure that the trip has available seats
        if (trip.availableSeats === 0) {
            await session.abortTransaction();
            res.status(400).json({ error: "No available seats" });
            return;
        }

        const route = trip.route;

        // ensure that the user has enough balance
        if (wallet.balance < route.fare) {
            await session.abortTransaction();
            res.status(400).json({ error: "Insufficient funds" });
            return;
        }

        // create transaction
        const transaction = await Transaction.create(
            [
                {
                    wallet: req.user.wallet?._id,
                    type: "deduct",
                    amount: route.fare,
                    balanceAfterTransaction: wallet.balance - route.fare,
                },
            ],
            { session }
        );

        // create booking
        const booking = await Booking.create(
            [
                {
                    user: req.user._id,
                    trip: trip._id,
                    transaction: transaction[0]._id,
                },
            ],
            { session }
        );

        transaction[0].booking = booking[0]._id;
        await transaction[0].save({ session });

        await trip.bookSeat();
        await wallet.deductFunds(route.fare);

        await session.commitTransaction();

        res.status(201).json({
            booking: {
                _id: booking[0]._id,
                startLocation:
                    route.startLocation?.description ?? "Unknown location",
                endLocation:
                    route.endLocation?.description ?? "Unknown location",
                startTime: trip.startTime,
                endTime: trip.endTime,
                tripId: booking[0].trip,
            },
            transaction: {
                _id: transaction[0]._id,
                type: transaction[0].type,
                amount: transaction[0].amount,
                balanceAfterTransaction: transaction[0].balanceAfterTransaction,
                createdAt: transaction[0].createdAt,
                route: {
                    startLocation:
                        route.startLocation?.description ?? "Unknown location",
                    endLocation:
                        route.endLocation?.description ?? "Unknown location",
                },
            },
        });
    } catch (err) {
        await session.abortTransaction();
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    } finally {
        await session.endSession();
    }
};

export const getBookingsByUserId: RequestHandler = async (req, res) => {
    try {
        const bookings = await Booking.aggregate([
            { $match: { user: req.user._id } },
            {
                $lookup: {
                    from: "trips",
                    localField: "trip",
                    foreignField: "_id",
                    as: "trip",
                },
            },
            { $match: { "trip.endTime": { $gte: new Date() } } },
            { $unwind: "$trip" },
            {
                $lookup: {
                    from: "routes",
                    localField: "trip.route",
                    foreignField: "_id",
                    as: "trip.route",
                },
            },
            {
                $unwind: "$trip.route",
            },
            {
                $project: {
                    tripId: "$trip._id",
                    startTime: "$trip.startTime",
                    endTime: "$trip.endTime",
                    startLocation: "$trip.route.startLocation.description",
                    endLocation: "$trip.route.endLocation.description",
                },
            },
        ]);

        res.json({ bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const deleteBooking: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid trip ID" });
            return;
        }

        const booking = await Booking.findOneAndDelete({ _id: id });
        if (!booking) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }

        res.status(204).json({});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getBookingsByTripId: RequestHandler = async (req, res) => {
    try {
        const { tripId } = req.query;

        if (!tripId) {
            res.status(400).json({ error: "Trip ID is required" });
            return;
        }

        if (!isValidObjectId(tripId)) {
            res.status(400).json({ error: "Invalid trip ID" });
            return;
        }
        const bookings = await Booking.aggregate([
            { $match: { trip: new mongoose.Types.ObjectId(tripId as string) } },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    user: {
                        _id: "$user._id",
                        firstName: "$user.firstName",
                        lastName: "$user.lastName",
                        studentId: "$user.studentId",
                    },
                },
            },
        ]);

        res.json({ bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
