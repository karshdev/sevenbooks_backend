
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as invoiceController from "./invoices.controller";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
        .get("/", roleAuth("USER") , invoiceController.getAllInvoices)
        .post("/", roleAuth("USER") , invoiceController.createInvoice)
      

export default router;

