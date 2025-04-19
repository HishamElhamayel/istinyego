import Shuttle from "#/models/shuttle.model";
import User from "#/models/user.model";
import { paginationQuery } from "#/types/misc.types";
import { RequestHandler } from "express";
import mongoose, { isValidObjectId } from "mongoose";

export const getAllProfiles: RequestHandler = async (req, res) => {
    try {
        const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
        const users = await User.find({})
            .select(" _id firstName lastName studentId ")
            .limit(parseInt(limit))
            .skip(parseInt(limit) * parseInt(pageNo))
            .sort({ firstName: 1 });

        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getAllDrivers: RequestHandler = async (req, res) => {
    try {
        const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
        const users = await User.find({ role: "driver" })
            .select(" _id firstName lastName studentId ")
            .limit(parseInt(limit))
            .skip(parseInt(limit) * parseInt(pageNo))
            .sort({ firstName: 1 });

        res.json({ drivers: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getAllProfileData: RequestHandler = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }
        const userId = new mongoose.Types.ObjectId(req.params.id);

        const user = await User.aggregate([
            { $match: { _id: userId } },
            {
                $project: {
                    password: 0,
                    tokens: 0,
                    __v: 0,
                    favoriteRoutes: 0,
                    updatedAt: 0,
                },
            },
            {
                $lookup: {
                    from: "wallets",
                    localField: "wallet",
                    foreignField: "_id",
                    as: "wallet",
                },
            },
            {
                $unwind: "$wallet",
            },
            {
                $lookup: {
                    from: "transactions",
                    localField: "wallet._id",
                    foreignField: "wallet",
                    as: "transactions",
                },
            },
            {
                $project: {
                    "wallet.__v": 0,
                    "transactions.__v": 0,
                    "transactions.wallet": 0,
                    "transactions.balanceAfterTransaction": 0,
                    "transactions.updatedAt": 0,
                },
            },
        ]);

        if (!user[0]) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const shuttle = await Shuttle.findOne(
            { driver: userId },
            {
                _id: 1,
                number: 1,
            }
        );
        if (shuttle) {
            user[0].shuttle = shuttle;
        }

        res.json({ user: user[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const updateProfile: RequestHandler = async (req, res) => {
    try {
        const userId = req.user._id;
        const { ...body } = req.body;

        const user = await User.findByIdAndUpdate(userId, body, { new: true });

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
