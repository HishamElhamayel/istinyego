import Shuttle from "#/models/shuttle.model";
import { RequestHandler } from "express";

export const createShuttle: RequestHandler = async (req, res) => {
    try {
        const { capacity, currentLocation, driver } = req.body;

        // console.log(Shuttle);

        const shuttle = await Shuttle.create({
            capacity,
            currentLocation,
            driver,
        });

        res.status(201).json({
            shuttle: await shuttle.populate("driver"),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
