import { getWalletBalance } from "#/controller/wallet.controller";
import { mustAuth } from "#/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/getBalance", mustAuth, getWalletBalance);

export default router;
