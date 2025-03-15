import { model, Schema } from "mongoose";

const transactionSchema = new Schema(
    {
        wallet: {
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

export default model("Transaction", transactionSchema);
