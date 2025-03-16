import { HydratedDocumentFromSchema, Schema, model } from "mongoose";

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

export type BookingDocument = HydratedDocumentFromSchema<typeof bookingSchema>;

const Booking = model<BookingDocument>("Booking", bookingSchema);
export default Booking;
