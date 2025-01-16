import * as chartService from "./chartaccount.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express';


export const createChartOfAccounts = asyncHandler(async (req: Request, res: Response) => {
    const result = await chartService.createChartOfAccounts(req.body, req.user!._id);
    res.send(createResponse(result, "Customer created successfully"));
});

export const getChartOfAccounts = asyncHandler(async (req: Request, res: Response) => {
    const result = await chartService.getChartOfAccounts(req.user!._id,req.query);
    res.send(createResponse(result, "Customer created successfully"));
});
export const updateChartOfAccounts = asyncHandler(async (req: Request, res: Response) => {
    const result = await chartService.updateChartOfAccounts(req.body ,req.params.id,req.user!._id);
    res.send(createResponse(result, "Customer created successfully"));
});

