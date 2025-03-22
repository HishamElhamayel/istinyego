import { HydratedDocumentFromSchema, model, Schema } from "mongoose";
import Booking from "./booking.model";

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

tripSchema.pre("findOneAndDelete", async function (next) {
    const trip = await this.model.findOne(this.getQuery());
    if (!trip) return;

    await Booking.deleteMany({ trip: trip._id });

    next();
});

tripSchema.pre("deleteMany", async function (next) {
    const trips = await this.model.find(this.getQuery());
    if (!trips || trips.length === 0) return;

    trips.forEach(async (trip) => {
        await Booking.deleteMany({ trip: trip._id });
    });

    next();
});

// bookingSchema.pre("deleteMany", async function (next) {
//     const bookings = await this.model.find(this.getQuery());
//     if (!bookings || bookings.length === 0) return;

//     bookings.forEach(async (booking) => {
//         const transaction = await Transaction.findById(booking.transaction);
//         if (!transaction) return;

//         const wallet = await Wallet.findById(transaction.wallet);
//         if (!wallet) return;

//         const newTransaction = await Transaction.create({
//             wallet: wallet._id,
//             type: "refund",
//             amount: transaction.amount,
//             balanceAfterTransaction:
//                 transaction.balanceAfterTransaction + transaction.amount,
//         });

//         if (newTransaction) {
//             wallet.addFunds(newTransaction.amount);
//         }
//     });

//     next();
// });

export type TripDocument = HydratedDocumentFromSchema<typeof tripSchema> & {
    bookSeat: () => Promise<number>;
};

const Trip = model<TripDocument>("Trip", tripSchema);
export default Trip;
