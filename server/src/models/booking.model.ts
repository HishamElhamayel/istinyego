import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        trip: {
            type: Schema.Types.ObjectId,
            ref: "Trip",
        },
        transaction: {
            type: Schema.Types.ObjectId,
            ref: "Transaction",
        },
    },
    {
        timestamps: true,
    }
);

export default model("Booking", bookingSchema);
