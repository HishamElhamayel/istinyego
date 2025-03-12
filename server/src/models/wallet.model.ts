import { Model, Schema, model, Document } from "mongoose";

interface WalletDocument extends Document {
    balance: number;
}

const walletSchema = new Schema<WalletDocument>({
    balance: {
        type: Number,
        default: 0,
    },
});

export default model("Wallet", walletSchema) as Model<WalletDocument>;
