import Route from "#/models/route.model";
import { RequestHandler } from "express";

export const createRoute: RequestHandler = async (req, res) => {
    try {
        const { startLocation, endLocation, fare } = req.body;

        const route = await Route.create({
            startLocation,
            endLocation,
            fare,
        });

        res.status(201).json({
            route: route,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
