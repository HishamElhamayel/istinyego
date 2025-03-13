import { Document, Schema, model } from "mongoose";

interface RouteDocument extends Document {
    startLocation: {
        type: string;
        coordinates: [number];
        address: string;
        description: string;
    };
    endLocation: {
        type: string;
        coordinates: [number];
        address: string;
        description: string;
    };
    fare: number;
}

const routeSchema = new Schema<RouteDocument>({
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

export default model<RouteDocument>("Route", routeSchema);
