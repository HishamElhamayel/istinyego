import { Document, model, ObjectId, Schema } from "mongoose";

export interface TransactionDocument extends Document {
    walletId: ObjectId;
    type: string;
    amount: number;
    balanceAfterTransaction: number;
}

const transactionSchema = new Schema<TransactionDocument>(
    {
        walletId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Wallet",
        },
        type: {
            type: String,
            required: true,
            enum: ["add", "deduct"],
        },
        amount: {
            type: Number,
            required: true,
        },
        balanceAfterTransaction: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default model<TransactionDocument>("Transaction", transactionSchema);
