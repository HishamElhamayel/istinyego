import { chargeWallet, getWalletBalance } from "#/controller/wallet.controller";
import { mustAuth } from "#/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/get-balance", mustAuth, getWalletBalance);
router.post("/charge-wallet", mustAuth, chargeWallet);

export default router;
