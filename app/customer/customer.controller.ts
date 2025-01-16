import * as customerService from "./customer.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express';

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
    const result = await customerService.createCustomer(req.body, req.user!._id);
    res.send(createResponse(result, "Customer created successfully"));
});

export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
    const result = await customerService.getCustomer(req.user!._id);
    res.send(createResponse(result, "Customers fetched successfully"));
});

export const getTopCustomers = asyncHandler(async (req: Request, res: Response) => {
    const result = await customerService.getTopCustomer(req.user!._id);
    res.send(createResponse(result, "Customers fetched successfully"));
});

export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
    const result = await customerService.getCustomerById(req.params.id, req.user!._id);
    res.send(createResponse(result, "Customer fetched successfully"));
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
    const result = await customerService.updateCustomer(req.params.id, req.user!._id, req.body);
    res.send(createResponse(result, "Customer updated successfully"));
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
    const result = await customerService.deleteCustomer(req.params.id, req.user!._id);
    res.send(createResponse(result, "Customer deleted successfully"));
});