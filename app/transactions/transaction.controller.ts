
import * as transactionService from "./transaction.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express'

export const createTransactions = asyncHandler(async (req: Request, res: Response) => {
    const result = await transactionService.createTransaction(req.body);
    res.send(createResponse(result, "Transaction created successfully"))
});

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const result = await transactionService.getTransactions();
    res.send(createResponse(result, "Transaction fetched successfully"))
});

export const createFunds = asyncHandler(async (req: Request, res: Response) => {
    const result = await transactionService.createFundTransfer(req.body);
    res.send(createResponse(result, "Transaction created successfully"))
});

export const getAccounts = asyncHandler(async (req: Request, res: Response) => {
    console.log("req.user!._id",req.user!._id);
    const result = await transactionService.getAccountsAndExpenses(req.user!._id);
    res.send(createResponse(result, "Accounts fetched successfully"))
});

export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
    const result = await transactionService.updateExpenseStatus(req.user!._id , req.body);
    res.send(createResponse(result, "Accounts fetched successfully"))
});


