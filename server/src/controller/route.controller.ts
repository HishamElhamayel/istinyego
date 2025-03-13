import { RequestHandler } from "express";

export const createRoute: RequestHandler = async (req, res) => {
    try {
        const { startLocation, endLocation, fare } = req.body;
    } catch (error) {}
};
