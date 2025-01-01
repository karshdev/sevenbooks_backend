
import { type BaseSchema } from "../common/dto/base.dto";

export interface Account extends BaseSchema {
        accountName: string;
        accountNumber: string;
        openingBalance: number;
        currentBalance: number;
        branchId: string;
        accountType: AccountType;
        isActive?: boolean;
        creditLimit?: number;
        interestRate?: number; 
        dueDate?: Date; 
        minimumPayment?: number; 
      }
      export interface FundTransfer {
        date?: Date;
        fromAccount: string; 
        toAccount: string; 
        amount: number;
        description?: string;
        status?: 'pending' | 'completed' | 'failed';
      }
      export enum AccountType {
        CHECKING = 'checking',
        CASH = 'cash',
        CREDIT_CARD = 'credit_card',
        LOAN = 'loan',
      }
      