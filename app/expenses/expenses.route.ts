
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as expenseController from "./expenses.controller";
import * as expenseValidator from "./expenses.validation";
import passport from "passport";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
        .get("/:id",roleAuth("USER") , expenseController.getExpenseById)
        .get("/",roleAuth("USER") , expenseController.getAllExpenses)
        .post("/" , roleAuth("USER") , expenseValidator.createExpense , catchError  , expenseController.createExpense)
        .post("/pay" , roleAuth("USER") , expenseController.payExpense)

export default router;