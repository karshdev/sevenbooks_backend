
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as chartController from "./chartaccount.controller";
import * as chartValidator from "./chartaccount.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
        .post("/" , roleAuth("USER") , chartValidator.createChartOfAccounts , catchError  , chartController.createChartOfAccounts)
        .get("/" , roleAuth("USER") , chartController.getChartOfAccounts)

export default router;