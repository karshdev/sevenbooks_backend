
import { Router } from "express";
import * as generalLedger from "./generalLedger.controller";

import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
        .get("/" , roleAuth("USER") , generalLedger.getGeneralLedger)


export default router;