
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as vendorController from "./vendor.controller";
import * as vendorValidator from "./vendor.validation";
import passport from "passport";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
        // .delete("/:id", vendorController.deleteUser)
        .post("/",roleAuth("USER") , vendorValidator.createVendorValidation, catchError, vendorController.createVendor)
        .get("/",roleAuth("USER") , vendorController.getVendors)

        // .put("/:id", vendorValidator.updateUser, catchError, vendorController.updateUser)
        // .patch("/:id", vendorValidator.editUser, catchError, vendorController.editUser)

export default router;

