
import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

   export interface Vendor extends BaseSchema {
        name: string;
        email: string;
        address: string;
        taxId: string;
        billNumber: string;
        dueDate: Date;
        user:Types.ObjectId
      }
      
      export interface Expense extends BaseSchema {
        vendor: Types.ObjectId;
        amount: number;
        status?: 'pending' | 'paid' | 'overdue';
        description?: string;
        quantity:number;
        unitPrice:number
        taxRate: number
        chartOfAccounts:Types.ObjectId
      }

     export interface CreateExpensePayload {
        vendor: {
          _id?:string
          name: string;
          email: string;
          address: string;
          taxId: string;
          billNumber: string;
          dueDate: Date;
        };
        expenses: [{
          amount: number;
          status?: 'pending' | 'paid' | 'overdue';
          description?: string;
          quantity: number;
          unitPrice: number;
          taxRate: number;
        }];
        chartOfAccounts?:string
      }

 export interface TransferFunds {
        vendor: {
          name: string;
          email: string;
          address: string;
          taxId: string;
          billNumber: string;
          dueDate: Date;
        };
        expense: [{
          amount: number;
          status?: 'pending' | 'paid' | 'overdue';
          description?: string;
          quantity: number;
          unitPrice: number;
          taxRate: number;
        }];
      }