import "dotenv/config";
import express from "express";
import "./db";
import authRouter from "./routes/auth.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);

const PORT = parseInt(process.env.PORT || "8989");

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
