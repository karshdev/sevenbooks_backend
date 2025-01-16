import * as generalLedgerService from "./generalLedger.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express';


export const getGeneralLedger = asyncHandler(async (req: Request, res: Response) => {
    const result = await generalLedgerService.getAllGeneralLedger(req.user!._id,req.query);
    res.send(createResponse(result, "Customer created successfully"));
});
