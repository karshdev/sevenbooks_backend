
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./invoices.controller";
import * as userValidator from "./invoices.validation";

const router = Router();

router
        .get("/", userController.getAllUser)
        .get("/:id", userController.getUserById)
        .delete("/:id", userController.deleteUser)
        .post("/", userValidator.createUser, catchError, userController.createUser)
        .put("/:id", userValidator.updateUser, catchError, userController.updateUser)
        .patch("/:id", userValidator.editUser, catchError, userController.editUser)

export default router;

