import "dotenv/config";
import express from "express";
import "./db";
import authRouter from "./routes/auth.route";
import walletRouter from "./routes/wallet.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/wallet", walletRouter);
// app.use("/route", routeRouter);

const PORT = parseInt(process.env.PORT || "8989");

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
