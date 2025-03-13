import {
    createTransaction,
    getAllTransactions,
    getTransactionsByWalletId,
} from "#/controller/transaction.controller";
import { mustAuth, mustRoles } from "#/middleware/auth.middleware";
import { validate } from "#/middleware/validator.middleware";
import { TransactionSchema } from "#/utils/validation";
import { Router } from "express";

const router = Router();

router.post(
    "/create",
    mustAuth,
    validate(TransactionSchema),
    createTransaction
);
router.get("/myTransactions", mustAuth, getTransactionsByWalletId);
router.get(
    "/getAllTransactions",
    mustAuth,
    mustRoles(["admin"]),
    getAllTransactions
);

export default router;
