import Trip from "#/models/trip.model";
import { RequestHandler } from "express";

export const createTrip: RequestHandler = async (req, res) => {
    try {
        const { shuttleId, routeId, startTime, endTime, date, availableSeats } =
            req.body;

        const trip = await Trip.create({
            shuttleId,
            routeId,
            startTime,
            endTime,
            date,
            availableSeats,
        });

        res.status(201).json({
            trip,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
