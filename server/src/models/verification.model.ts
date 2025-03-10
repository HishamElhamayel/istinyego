import { compare, hash } from "bcryptjs";
import { Model, model, ObjectId, Schema } from "mongoose";

interface VerificationDocument {
    owner: ObjectId;
    token: string;
    createdAt: Date;
}

interface Methods {
    compareToken(token: string): Promise<boolean>;
}

const verificationSchema = new Schema<VerificationDocument, {}, Methods>({
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 },
});

verificationSchema.pre("save", async function (next) {
    if (this.isModified("token")) {
        this.token = await hash(this.token, 10);
    }
    next();
});

verificationSchema.methods.compareToken = async function (token) {
    const result = await compare(token, this.token);
    return result;
};

export default model("EmailVerificationToken", verificationSchema) as Model<
    VerificationDocument,
    {},
    Methods
>;
