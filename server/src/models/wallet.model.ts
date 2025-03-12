import { Document, Schema, model } from "mongoose";

export interface WalletDocument extends Document {
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
