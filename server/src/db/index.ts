import { MONGO_URI } from "#/utils/variables";
import mongoose from "mongoose";

mongoose
  .connect(MONGO_URI, { dbName: "IstinyeGo" })
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log("db connection failed", err);
  });
