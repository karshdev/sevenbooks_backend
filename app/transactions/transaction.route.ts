
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as transactionController from "./transaction.controller";
import * as transactionValidator from "./transaction.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
        .get("/", transactionController.getTransactions)
        .post("/", transactionValidator.createTransactionValidation, catchError, transactionController.createTransactions)
        .post("/transfer-funds",  transactionController.createTransactions)
        .get("/get-funds", roleAuth("USER") , transactionController.getAccounts)
        .post("/update-expense", roleAuth("USER") , transactionController.updateExpense)



export default router;