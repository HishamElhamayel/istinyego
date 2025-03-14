import { compare, hash } from "bcryptjs";
import { model, Schema } from "mongoose";

const tokenSchema = new Schema(
    {
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
    },
    {
        methods: {
            compareToken: async function (token: string) {
                const result = await compare(token, this.token);
                return result;
            },
        },
    }
);

tokenSchema.pre("save", async function (next) {
    if (this.isModified("token")) {
        this.token = await hash(this.token, 10);
    }
    next();
});

export default model("Token", tokenSchema);
