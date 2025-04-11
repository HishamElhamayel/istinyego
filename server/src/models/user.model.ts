import { compare, hash } from "bcryptjs";
import { HydratedDocumentFromSchema, model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        studentId: {
            type: Number,
            // required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            // select: false,
        },
        role: {
            type: String,
            enum: ["user", "admin", "driver"],
            default: "user",
        },
        phoneNumber: {
            type: Number,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        tokens: [
            {
                type: String,
            },
        ],
        wallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },
        favoriteRoutes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Route",
            },
        ],
        licenseNumber: { type: Number },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.comparePassword = async function (password: string) {
    const result = await compare(password, this.password);
    return result;
};

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await hash(this.password, 10);
    }
    next();
});

export type UserDocument = HydratedDocumentFromSchema<typeof userSchema> & {
    comparePassword: (password: string) => Promise<boolean>;
};

const User = model<UserDocument>("User", userSchema);
export default User;
