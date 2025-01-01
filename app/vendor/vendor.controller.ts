
import * as vendorService from "./vendor.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express'


export const createVendor = asyncHandler(async (req: Request, res: Response) => {
    const result = await vendorService.createVendor(req.body , req?.user!._id);
    res.send(createResponse(result, "Vendor created successfully"))
});
export const getVendors = asyncHandler(async (req: Request, res: Response) => {
    const result = await vendorService.getVendors(req?.user!._id);
    res.send(createResponse(result, "Vendor Fetched successfully"))
});