import { HydratedDocumentFromSchema, Schema, model } from "mongoose";
import Transaction from "./transaction.model";
import Trip from "./trip.model";
import Wallet from "./wallet.model";

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

bookingSchema.pre("findOneAndDelete", async function (next) {
    const booking = await this.model.findOne(this.getQuery());
    if (!booking) return;

    const transaction = await Transaction.findById(booking.transaction);
    if (!transaction) return;

    const wallet = await Wallet.findById(transaction.wallet);
    if (!wallet) return;

    const newTransaction = await Transaction.create({
        wallet: wallet._id,
        type: "refund",
        amount: transaction.amount,
        balanceAfterTransaction:
            transaction.balanceAfterTransaction + transaction.amount,
    });

    if (newTransaction) {
        wallet.addFunds(newTransaction.amount);
        next();
    }
});

bookingSchema.pre("deleteMany", async function (next) {
    const bookings = await this.model.find(this.getQuery());
    if (!bookings || bookings.length === 0) return;

    bookings.forEach(async (booking) => {
        const trip = await Trip.findOne(booking.trip);
        if (!trip) return;
        if (trip.state === "scheduled") {
            const transaction = await Transaction.findById(booking.transaction);
            if (!transaction) return;

            const wallet = await Wallet.findById(transaction.wallet);
            if (!wallet) return;

            const newTransaction = await Transaction.create({
                wallet: wallet._id,
                type: "refund",
                amount: transaction.amount,
                balanceAfterTransaction:
                    transaction.balanceAfterTransaction + transaction.amount,
            });

            if (newTransaction) {
                wallet.addFunds(newTransaction.amount);
            }
        }
    });

    next();
});

export type BookingDocument = HydratedDocumentFromSchema<typeof bookingSchema>;

const Booking = model<BookingDocument>("Booking", bookingSchema);
export default Booking;
