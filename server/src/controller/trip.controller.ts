import Trip from "#/models/trip.model";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const createTrip: RequestHandler = async (req, res) => {
    try {
        const { shuttleId, routeId, startTime, endTime, date, availableSeats } =
            req.body;

        const trip = await Trip.create({
            shuttle: shuttleId,
            route: routeId,
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

        const trips = await Trip.find({ route: routeId, date });

        if (trips.length === 0) {
            res.status(404).json({ error: "No trips found" });
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
