import { Document, model, ObjectId, Schema } from "mongoose";

export interface TransactionDocument extends Document {
    _id: ObjectId;
    walletId: ObjectId;
    type: string;
    amount: number;
    date: Date;
    balanceAfterTransaction: number;
}

const transactionSchema = new Schema<TransactionDocument>({
    walletId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Wallet",
    },
    type: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    balanceAfterTransaction: {
        type: Number,
        required: true,
    },
});

export default model<TransactionDocument>("Transaction", transactionSchema);
