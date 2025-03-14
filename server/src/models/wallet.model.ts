import { Schema, model } from "mongoose";

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

export default model("Wallet", walletSchema);
