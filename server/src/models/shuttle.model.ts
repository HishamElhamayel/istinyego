import { model, Schema } from "mongoose";

const shuttleSchema = new Schema({
    capacity: {
        type: Number,
        required: true,
        max: 30,
    },
    currentLocation: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        coordinates: [Number],
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

export default model("Shuttle", shuttleSchema);
