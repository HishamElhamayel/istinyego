import { MONGO_URI } from "#/utils/variables";
import mongoose from "mongoose";

mongoose
    .connect(MONGO_URI, { dbName: "IstinyeGo" })
    .then(() => {
        console.log("Database is connected");
    })
    .catch((err) => {
        console.log("Database connection failed", err);
    });
