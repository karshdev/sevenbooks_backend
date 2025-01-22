
import { Router } from "express";
import * as inventoryController from "./inventory.controller";

import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
        .post("/" , roleAuth("USER") , inventoryController.createInventory)
        .get("/" , roleAuth("USER") , inventoryController.getInventory)



export default router;