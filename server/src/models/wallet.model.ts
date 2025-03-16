import { HydratedDocumentFromSchema, Schema, model } from "mongoose";

const walletSchema = new Schema({
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

export type WalletDocument = HydratedDocumentFromSchema<typeof walletSchema> & {
    addFunds: (amount: number) => Promise<number>;
    deductFunds: (amount: number) => Promise<number>;
};

const Wallet = model<WalletDocument>("Wallet", walletSchema);
export default Wallet;
