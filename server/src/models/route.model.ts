import { Schema, model } from "mongoose";

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

export default model("Route", routeSchema);
