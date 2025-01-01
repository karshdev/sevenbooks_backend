
import * as bankService from "./banking.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express'

export const createAccount = asyncHandler(async (req: Request, res: Response) => {
    const result = await bankService.createAccount(req.body);
    res.send(createResponse(result, "Account created successfully"))
});

export const updateAccount = asyncHandler(async (req: Request, res: Response) => {
    const result = await bankService.updateAccount(req.body , req.params.id,);
    res.send(createResponse(result, "Account updated successfully"))
});

export const getAccounts = asyncHandler(async (req: Request, res: Response) => {
    const result = await bankService.getAccounts();
    res.send(createResponse(result, "Account fetched successfully"))
});

