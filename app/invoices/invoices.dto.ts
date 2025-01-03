import { Types } from "mongoose";


export enum InvoiceStatus {
        DRAFT = 'draft',
        SENT = 'sent',
        PAID = 'paid',
        OVERDUE = 'overdue'
      }
      
      export enum InvoiceTerms {
        NET_30 = 'Net 30',
        NET_15 = 'Net 15',
        DUE_ON_RECEIPT = 'Due on receipt'
      }
      
      export interface TaxInfo {
        rate: number;
        region: string;
      }
      
      export interface LineItem {
        description: string;
        quantity: number;
        rate: number;
        amount: number;
      }
      
     export  interface Invoice {
        user:string
        customer: string;
        invoiceNumber: string;
        status: InvoiceStatus;
        terms: InvoiceTerms;
        invoiceDate: Date;
        dueDate: Date;
        billingAddress: string;
        lineItems: LineItem[];
        tax: TaxInfo;
        subtotal: number;
        taxAmount: number;
        total: number;
        notes?: string;
      }
      export interface InvoiceQueryParams {
        status?: InvoiceStatus;
        customer?: string;
        startDate?: string;
        endDate?: string;
      }