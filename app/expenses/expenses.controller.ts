
import * as expenseService from "./expense.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express'

export const createExpense = asyncHandler(async (req: Request, res: Response) => {  
    const result = await expenseService.createExpense(req.body);
    res.send(createResponse(result, "Expense created successfully"))
});

export const getExpenseById = asyncHandler(async (req: Request, res: Response) => {
    const result = await expenseService.getExpenseById(req.params.id ,req.user!._id);
    res.send(createResponse(result, "Expense updated successfully"))
});

export const  getAllExpenses = asyncHandler(async (req: Request, res: Response) => {
    const result = await expenseService.getExpenses(req.user!._id);
    res.send(createResponse(result, "Expense updated successfully"))
});
export const  payExpense = asyncHandler(async (req: Request, res: Response) => {
    const result = await expenseService.payExpenses(req.body ,req.user!._id);
    res.send(createResponse(result, "Expense updated successfully"))
});

