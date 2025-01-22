import * as inventoryService from "./inventory.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express';


export const createInventory = asyncHandler(async (req: Request, res: Response) => {
    const result = await inventoryService.createInventory(req.user!._id,req.body);
    res.send(createResponse(result, "Inventory created successfully"));
});

export const getInventory = asyncHandler(async (req: Request, res: Response) => {
    const result = await inventoryService.getInventory(req.user!._id);
    res.send(createResponse(result, "Inventory fetching successfully"));
});
