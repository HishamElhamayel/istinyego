import { ObjectId, Schema, model } from "mongoose";

interface RouteDocument extends Document {
    _id: ObjectId;
    startLocation: string;
    endLocation: string;
    fare: number;
}

const routeSchema = new Schema<RouteDocument>({
    startLocation: {
        type: String,
        required: true,
        trim: true,
    },
    endLocation: {
        type: String,
        required: true,
        trim: true,
    },
    fare: {
        type: Number,
        default: 60,
    },
});

export default model<RouteDocument>("Route", routeSchema);
