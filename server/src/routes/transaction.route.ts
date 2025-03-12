import {
    createTransaction,
    getAllTransactions,
    getTransactionsByWalletId,
} from "#/controller/transaction.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/create", mustAuth, createTransaction);
router.get("/myTransactions", mustAuth, getTransactionsByWalletId);
router.get(
    "/getAllTransactions",
    mustAuth,
    mustRoles(["admin"]),
    getAllTransactions
);

export default router;
