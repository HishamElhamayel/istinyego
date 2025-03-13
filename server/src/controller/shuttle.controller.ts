import Shuttle from "#/models/shuttle.model";
import User from "#/models/user.model";
import { RequestHandler } from "express";

export const createShuttle: RequestHandler = async (req, res) => {
    try {
        const { capacity, currentLocation, driver } = req.body;

        // console.log(Shuttle);
        const user = await User.findById(driver);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        } else if (user.role !== "driver") {
            res.status(403).json({ error: "User is not a driver" });
            return;
        }

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
