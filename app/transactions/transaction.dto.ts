import { Types } from "mongoose";
import { BaseSchema } from "../common/dto/base.dto";

export interface ITransaction extends BaseSchema {
        accountId: Types.ObjectId; 
        date: Date;
        payee: string; 
        bankMemo?: string; 
        account: "checking" | "cash" | "credit_card" | "loan"; 
        payment?: number;
        deposit?: number; 
        action: "Approved" | "Pending" | "Rejected"; 
      }

      export interface IFunds extends BaseSchema {
        fromAccount: Types.ObjectId; 
        toAccount: Types.ObjectId;
        bankMemo?: string; 
        amount:number;
        date: Date;
      }