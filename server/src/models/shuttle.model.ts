import { Document, model, ObjectId, Schema } from "mongoose";

export interface ShuttleDocument extends Document {
    capacity: number;
    currentLocation: {
        type: string;
        coordinates: [number];
    };
    driver: ObjectId;
}

const shuttleSchema = new Schema<ShuttleDocument>({
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

export default model<ShuttleDocument>("Shuttle", shuttleSchema);
