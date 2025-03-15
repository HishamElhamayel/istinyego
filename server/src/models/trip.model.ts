import { model, Schema } from "mongoose";

const tripSchema = new Schema(
    {
        shuttleId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Shuttle",
        },
        routeId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Route",
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        date: {
            type: String, //2025-03-15
            required: true,
        },
        availableSeats: {
            type: Number,
            required: true,
        },
        state: {
            type: String,
            enum: ["scheduled", "inProgress", "completed"],
            default: "scheduled",
            required: true,
        },
    },
    {
        methods: {
            bookSeat: async function () {
                this.availableSeats -= 1;
                await this.save();
                return this.availableSeats;
            },
        },
    }
);

export default model("Trip", tripSchema);
