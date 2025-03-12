import { Document, ObjectId, Schema, model } from "mongoose";
interface WalletDocument extends Document {
    _id: ObjectId;
    balance: number;
    addFunds(amount: number): Promise<number>;
    deductFunds(amount: number): Promise<number>;
}

const walletSchema = new Schema<WalletDocument>({
    balance: {
        type: Number,
        default: 0,
    },
});

walletSchema.methods.addFunds = async function (amount: number) {
    this.balance += amount;
    await this.save();
    return this.balance;
};

walletSchema.methods.deductFunds = async function (amount: number) {
    this.balance -= amount;
    await this.save();
    return this.balance;
};

export default model<WalletDocument>("Wallet", walletSchema);
