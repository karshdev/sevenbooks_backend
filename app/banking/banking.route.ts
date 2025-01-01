
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as bankController from "./banking.controller";
import * as bankValidator from "./banking.validation";

const router = Router();

router
        .post("/", bankValidator.createAccount, catchError, bankController.createAccount)
        .put("/:id", bankValidator.updateAccount, catchError, bankController.updateAccount)
        .get("/", bankController.getAccounts)


export default router;

