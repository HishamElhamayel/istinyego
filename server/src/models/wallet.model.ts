import { Document, ObjectId, Schema, model } from "mongoose";
interface WalletDocument extends Document {
    _id: ObjectId;
    balance: number;
}

const walletSchema = new Schema<WalletDocument>({
    balance: {
        type: Number,
        default: 0,
    },
});

export default model<WalletDocument>("Wallet", walletSchema);
