import Shuttle from "#/models/shuttle.model";
import User from "#/models/user.model";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const createShuttle: RequestHandler = async (req, res) => {
    try {
        const { capacity, currentLocation, driver, number } = req.body;

        // console.log(Shuttle);
        const user = await User.findById(driver);
        if (!user) {
            res.status(404).json({ error: "Driver not found" });
            return;
        } else if (user.role !== "driver") {
            res.status(403).json({ error: "User is not a driver" });
            return;
        }

        const shuttle = await Shuttle.create({
            capacity,
            currentLocation,
            driver,
            number,
        });

        res.status(201).json({
            message: "Shuttle created successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getAllShuttles: RequestHandler = async (req, res) => {
    try {
        const shuttles = await Shuttle.find({}, { _id: 1, number: 1 });

        res.json({
            shuttles,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getShuttleById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const shuttle = await Shuttle.findById(id).populate("driver", {
            _id: 1,
            firstName: 1,
            lastName: 1,
            studentId: 1,
        });

        if (!shuttle) {
            res.status(404).json({ error: "Shuttle not found" });
            return;
        }

        res.json({
            shuttle,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getShuttleLocation: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const shuttle = await Shuttle.findById(id).select({
            currentLocation: 1,
        });

        if (!shuttle) {
            res.status(404).json({ error: "Shuttle not found" });
            return;
        }

        res.json({
            shuttle,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const deleteShuttle: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid shuttle ID" });
            return;
        }

        const shuttle = await Shuttle.findOneAndDelete({ _id: id });
        if (!shuttle) {
            res.status(404).json({ error: "Shuttle not found" });
            return;
        }

        res.status(204).json({});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const updateShuttleLocation: RequestHandler = async (req, res) => {
    try {
        const userId = req.user._id;

        const { location } = req.body;
        const shuttle = await Shuttle.findOneAndUpdate(
            { driver: userId },
            {
                $set: { "currentLocation.coordinates": location },
            },
            { new: true, runValidators: true }
        );

        if (!shuttle) {
            res.status(404).json({ error: "Shuttle not found" });
            return;
        }

        res.json({
            message: "Shuttle location updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const updateShuttle: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { capacity, driver, number } = req.body;

        if (!isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid shuttle ID" });
            return;
        }

        const otherShuttle = await Shuttle.findOne({
            number,
        })
            .where("_id")
            .ne(id);
        if (otherShuttle) {
            res.status(400).json({ error: "Shuttle number already exists" });
            return;
        }

        const shuttle = await Shuttle.findByIdAndUpdate(
            id,
            {
                capacity,
                driver,
                number,
            },
            { new: true }
        );

        if (!shuttle) {
            res.status(404).json({ error: "Shuttle not found" });
            return;
        }

        res.json({
            message: "Shuttle updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getShuttleByDriverId: RequestHandler = async (req, res) => {
    try {
        const userId = req.user._id;

        const shuttle = await Shuttle.findOne({ driver: userId }).select({
            _id: 1,
            number: 1,
        });

        if (!shuttle) {
            res.status(404).json({ error: "No shuttles found for this user" });
            return;
        }

        res.json({
            shuttle,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
