import {
    HydratedDocument,
    HydratedDocumentFromSchema,
    InferSchemaType,
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

export type TransactionDocument = HydratedDocumentFromSchema<
    typeof transactionSchema
>;

const Transaction = model<TransactionDocument>(
    "Transaction",
    transactionSchema
);
export default Transaction;
