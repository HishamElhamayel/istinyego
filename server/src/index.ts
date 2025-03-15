import "dotenv/config";
import express from "express";
import "./db";
import authRouter from "./routes/auth.route";
import routeRouter from "./routes/route.route";
import shuttleRouter from "./routes/shuttle.route";
import transactionRouter from "./routes/transaction.route";
import tripRouter from "./routes/trip.route";
import walletRouter from "./routes/wallet.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/wallet", walletRouter);
app.use("/transaction", transactionRouter);
app.use("/route", routeRouter);
app.use("/shuttle", shuttleRouter);
app.use("/trip", tripRouter);

const PORT = parseInt(process.env.PORT || "8989");

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
