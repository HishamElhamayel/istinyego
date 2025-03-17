import {
    // HydratedDocument,
    HydratedDocumentFromSchema,
    // InferSchemaType,
    model,
    Schema,
} from "mongoose";

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
            enum: ["add", "deduct", "refund"], //Refund occurs when a a tip is canceled
        },
        amount: {
            type: Number,
            required: true,
        },
        balanceAfterTransaction: {
            type: Number,
            required: true,
        },
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Transaction",
        },
    },
    { timestamps: true }
);

export type TransactionDocument = HydratedDocumentFromSchema<
    typeof transactionSchema
>;

const Transaction = model<TransactionDocument>(
    "Transaction",
    transactionSchema
);
export default Transaction;
