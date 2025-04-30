import {
    getTransactions,
    getTransactionsByWalletId,
} from "#/controller/transaction.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

// router.post(
//     "/create",
//     mustAuth,
//     validate(CreateTransactionSchema),
//     createTransaction
// );
router.get("/get-transactions", mustAuth, getTransactions);
router.get(
    "/:walletId",
    mustAuth,
    mustRoles("admin"),
    getTransactionsByWalletId
);

export default router;
