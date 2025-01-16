
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as expenseController from "./customer.controller";
import * as expenseValidator from "./customer.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
        .get("/:id",roleAuth("USER") , expenseController.getCustomerById)
        .post("/" , roleAuth("USER") , expenseValidator.createCustomer , catchError  , expenseController.createCustomer)
        .get("/" , roleAuth("USER") , catchError , expenseController.getCustomers)
        .get("/top/customer" , roleAuth("USER") , catchError , expenseController.getTopCustomers)


export default router;