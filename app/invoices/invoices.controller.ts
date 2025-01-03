
import * as invoiceService from "./invoices.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express'
import { InvoiceQueryParams, InvoiceStatus } from "./invoices.dto";



export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
    const result = await invoiceService.createInvoice(req.body,req?.user!._id);
    res.send(createResponse(result, "Invoice created sucssefully"))
});



export const getAllInvoices = asyncHandler(async (req: Request, res: Response) => {
    const queryParams = req.query as InvoiceQueryParams;
    const result = await invoiceService.getAllInvoices(queryParams, req.user!._id);
    res.send(createResponse(result,"Invoices fetched sucssefully"));
});