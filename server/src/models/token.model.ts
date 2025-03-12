import { compare, hash } from "bcryptjs";
import { model, ObjectId, Schema } from "mongoose";

interface TokenDocument {
    owner: ObjectId;
    token: string;
    createdAt: Date;
    compareToken(token: string): Promise<boolean>;
}

const tokenSchema = new Schema<TokenDocument>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

tokenSchema.pre("save", async function (next) {
    if (this.isModified("token")) {
        this.token = await hash(this.token, 10);
    }
    next();
});

tokenSchema.methods.compareToken = async function (token: string) {
    const result = await compare(token, this.token);
    return result;
};

export default model<TokenDocument>("Token", tokenSchema);
