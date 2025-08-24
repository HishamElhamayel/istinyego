import Route from "#/models/route.model";
import Shuttle from "#/models/shuttle.model";
import Trip from "#/models/trip.model";
import { RequestHandler } from "express";
import { DateTime } from "luxon";
import mongoose, { isValidObjectId } from "mongoose";

export const createTrip: RequestHandler = async (req, res) => {
    try {
        const { startTime, endTime, date, availableSeats } = req.body;

        const shuttleId = new mongoose.Types.ObjectId(req.body.shuttleId);
        const routeId = new mongoose.Types.ObjectId(req.body.routeId);

        if (
            !(await Shuttle.exists({ _id: shuttleId })) ||
            !(await Route.exists({ _id: routeId }))
        ) {
            res.status(404).json({ error: "Shuttle or route not found" });
            return;
        }

        const duplicate = req.body.duplicate ?? 1;
        const tripsArray = [];

        for (let i = 0; i < duplicate; i++) {
            tripsArray.push({
                shuttle: shuttleId,
                route: routeId,
                startTime: DateTime.fromISO(startTime).plus({ weeks: i }),
                endTime: DateTime.fromISO(endTime).plus({ weeks: i }),
                date: DateTime.fromFormat(date, "yyyy-MM-dd")
                    .plus({ weeks: i })
                    .toFormat("yyyy-MM-dd"),
                availableSeats,
            });
        }

        await Trip.create(tripsArray);

        res.status(201).json({
            message: "Trip created successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const deleteTrip: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid trip ID" });
            return;
        }

        const trip = await Trip.findOneAndDelete({ _id: id });
        if (!trip) {
            res.status(404).json({ error: "Trip not found" });
            return;
        }

        res.status(204).json({});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getTripsByRouteId: RequestHandler = async (req, res) => {
    try {
        const { routeId, date } = req.query as {
            routeId: string;
            date: string;
        };

        if (
            !isValidObjectId(routeId) ||
            !routeId ||
            !date ||
            !Date.parse(date)
        ) {
            res.status(400).json({ error: "Invalid query parameters" });
            return;
        }

        const trips = await Trip.find({
            route: routeId,
            date,
            state: { $ne: "completed" },
        })
            .select({
                _id: 1,
                startTime: 1,
                endTime: 1,
                availableSeats: 1,
                status: 1,
            })
            .sort({
                startTime: 1,
            });

        if (trips.length === 0) {
            res.json({ message: "No trips found" });
            return;
        }

        res.json({
            trips,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getTripsByShuttleId: RequestHandler = async (req, res) => {
    const {
        shuttleId,
        date,
        // time = date, //if no date is provided, use start of the day
    } = req.query as {
        shuttleId: string;
        date: string;
        // time: string;
    };

    if (
        !isValidObjectId(shuttleId) ||
        !shuttleId ||
        !date ||
        !Date.parse(date)
    ) {
        res.status(400).json({ error: "Invalid query parameters" });
        return;
    }

    const trips = await Trip.aggregate([
        {
            $match: {
                shuttle: new mongoose.Types.ObjectId(shuttleId),
                date: date,
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
            $lookup: {
                from: "shuttles",
                localField: "shuttle",
                foreignField: "_id",
                as: "shuttle",
            },
        },
        {
            $unwind: "$shuttle",
        },
        {
            $project: {
                _id: 1,
                shuttle: {
                    _id: "$shuttle._id",
                    number: "$shuttle.number",
                },
                routeId: "$route._id",
                startLocation: "$route.startLocation.description",
                endLocation: "$route.endLocation.description",
                fare: "$route.fare",
                startTime: 1,
                endTime: 1,
                date: 1,
                availableSeats: 1,
                state: 1,
            },
        },
    ]);

    res.json({
        trips,
    });
};

export const getTripById: RequestHandler = async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        // console.log(req.params);
        res.status(400).json({ error: "Invalid trip ID" });
        return;
    }

    const tripId = new mongoose.Types.ObjectId(req.params.id);

    // console.log("hi");

    const trip = await Trip.aggregate([
        { $match: { _id: tripId } },
        {
            $unset: "__v",
        },
        {
            $lookup: {
                from: "shuttles",
                localField: "shuttle",
                foreignField: "_id",
                as: "shuttle",
            },
        },
        {
            $unwind: "$shuttle",
        },
        {
            $lookup: {
                from: "routes",
                localField: "route",
                foreignField: "_id",
                as: "route",
            },
        },
        { $unwind: "$route" },
        {
            $project: {
                _id: 1,
                shuttle: {
                    _id: "$shuttle._id",
                    number: "$shuttle.number",
                },
                routeId: "$route._id",
                startLocation: "$route.startLocation.description",
                endLocation: "$route.endLocation.description",
                fare: "$route.fare",
                startTime: 1,
                endTime: 1,
                date: 1,
                availableSeats: 1,
                state: 1,
            },
        },
    ]);

    // const trip = await Trip.findById(tripId);
    if (!trip) {
        res.status(404).json({ error: "Trip not found" });
        return;
    }

    res.json({
        trip: trip[0],
    });
    return;
};

export const updateTripStateToInProgress: RequestHandler = async (req, res) => {
    try {
        const { tripId } = req.params;

        if (!isValidObjectId(tripId)) {
            res.status(400).json({ error: "Invalid trip ID" });
            return;
        }

        const trip = await Trip.findByIdAndUpdate(
            tripId,
            { state: "inProgress" },
            { new: true }
        );

        if (!trip) {
            res.status(404).json({ error: "Trip not found" });
            return;
        }

        res.status(200).json({
            message: "Trip started",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const updateTripStateToCompleted: RequestHandler = async (req, res) => {
    try {
        const { tripId } = req.params;

        if (!isValidObjectId(tripId)) {
            res.status(400).json({ error: "Invalid trip ID" });
            return;
        }

        const trip = await Trip.findByIdAndUpdate(
            tripId,
            { state: "completed" },
            { new: true }
        );

        if (!trip) {
            res.status(404).json({ error: "Trip not found" });
            return;
        }

        res.status(200).json({
            message: "Trip completed",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getNextFiveTrips: RequestHandler = async (req, res) => {
    try {
        const trips = await Trip.aggregate([
            {
                $match: {
                    startTime: { $gte: new Date() },
                },
            },
            {
                $sort: {
                    startTime: 1,
                },
            },
            {
                $limit: 5,
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

        if (trips.length === 0) {
            res.json({ message: "No upcoming trips found" });
            return;
        }

        res.json({
            trips,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
