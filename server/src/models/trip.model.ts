import { HydratedDocumentFromSchema, model, Schema } from "mongoose";

const tripSchema = new Schema({
    shuttle: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Shuttle",
    },
    route: {
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
});

tripSchema.methods.bookSeat = async function () {
    this.availableSeats -= 1;
    await this.save();
    return this.availableSeats;
};

export type TripDocument = HydratedDocumentFromSchema<typeof tripSchema> & {
    bookSeat: () => Promise<number>;
};

const Trip = model<TripDocument>("Trip", tripSchema);
export default Trip;
