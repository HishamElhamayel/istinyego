import { HydratedDocumentFromSchema, model, Schema } from "mongoose";
import Trip from "./trip.model";

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
    number: {
        type: Number,
        required: true,
        unique: true,
    },
});

shuttleSchema.pre("findOneAndDelete", async function (next) {
    const shuttle = await this.model.findOne(this.getQuery());
    if (!shuttle) return;

    await Trip.deleteMany({ shuttle: shuttle._id });

    next();
});

export type ShuttleDocument = HydratedDocumentFromSchema<typeof shuttleSchema>;

const Shuttle = model<ShuttleDocument>("Shuttle", shuttleSchema);
export default Shuttle;
