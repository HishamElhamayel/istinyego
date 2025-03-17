import User from "#/models/user.model";
import { paginationQuery } from "#/types/misc.types";
import { RequestHandler } from "express";

export const getAllProfiles: RequestHandler = async (req, res) => {
    const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
    const users = await User.find({})
        .select(" _id firstName lastName studentId ")
        .limit(parseInt(limit))
        .skip(parseInt(limit) * parseInt(pageNo))
        .sort({ firstName: 1 });

    res.json({ users });
};
