import { HydratedDocumentFromSchema, Schema, model } from "mongoose";
import Trip from "./trip.model";

const routeSchema = new Schema({
    startLocation: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    endLocation: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    fare: {
        type: Number,
        default: 60,
    },
});

routeSchema.pre("findOneAndDelete", async function (next) {
    const route = await this.model.findOne(this.getQuery());
    if (!route) return;

    await Trip.deleteMany({ route: route._id });

    next();
});

export type RouteDocument = HydratedDocumentFromSchema<typeof routeSchema>;

const Route = model<RouteDocument>("Route", routeSchema);
export default Route;
