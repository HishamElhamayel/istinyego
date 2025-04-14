import Route from "#/models/route.model";
import { RequestHandler } from "express";
import mongoose, { isValidObjectId } from "mongoose";

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

export const getRouteById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const route = await Route.findById(id);
        if (!route) {
            res.status(404).json({ error: "Route not found" });
            return;
        }
        res.status(200).json({ route: route });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getFavRoutes: RequestHandler = async (req, res) => {
    try {
        const routes = await Route.aggregate([
            { $match: { _id: { $in: req.user.favoriteRoutes } } },
            {
                $project: {
                    _id: 1,
                    startLocation: "$startLocation.description",
                    endLocation: "$endLocation.description",
                },
            },
        ]);

        if (!routes) {
            res.status(404).json({ error: "Route not found" });
            return;
        }

        res.status(201).json({
            routes: routes,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getAllRoutes: RequestHandler = async (req, res) => {
    try {
        const routes = await Route.aggregate([
            {
                $project: {
                    _id: 1,
                    startLocation: "$startLocation.description",
                    endLocation: "$endLocation.description",
                },
            },
        ]);

        res.status(201).json({
            routes: routes,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const updateRoute: RequestHandler = async (req, res) => {
    try {
        const { routeId } = req.params;
        const { startLocation, endLocation, fare } = req.body;
        // console.log(id);

        const route = await Route.findByIdAndUpdate(routeId, {
            startLocation,
            endLocation,
            fare,
        });

        if (!route) {
            res.status(404).json({ error: "Route not found" });
            return;
        }

        res.json({
            route: route,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const deleteRoute: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid shuttle ID" });
            return;
        }

        const route = await Route.findByIdAndDelete(id);
        if (!route) {
            res.status(404).json({ error: "Route not found" });
            return;
        }

        res.status(204).json({});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const toggleFavRoute: RequestHandler = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            res.status(400).json({ error: "Invalid route ID" });
            return;
        }

        const routeId = new mongoose.Types.ObjectId(req.params.id);
        const { user } = req;

        if (!(await Route.exists({ _id: routeId }))) {
            res.status(404).json({ error: "Route not found" });
            return;
        }

        if (user.favoriteRoutes.includes(routeId)) {
            user.favoriteRoutes = user.favoriteRoutes.filter(
                (id) => !id.equals(routeId)
            );
        } else {
            user.favoriteRoutes.push(routeId);
        }

        await user.save();

        res.status(200).json({
            favoriteRoutes: user.favoriteRoutes,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
