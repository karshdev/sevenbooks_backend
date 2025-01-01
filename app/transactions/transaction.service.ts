import { Types } from "mongoose";
import { Account } from "../banking/banking.dto";
import { AccountModel, FundTransferModel } from "../banking/banking.schema";
import { Vendor } from "../expenses/expenses.dto";
import { ExpenseModel, VendorModel } from "../expenses/expenses.schema";
import { IFunds, ITransaction } from "./transaction.dto";
import { Transaction } from "./transaction.schema";

interface AccountExpensesResponse {
  success: boolean;
  message: string;
  data: {
      accounts?: Array<{
          accountId: string;
          accountName: string;
          accountNumber: string;
          currentBalance: number;
          accountType: string;
          isActive: boolean;
          expenses: Array<{
              id: string;
              vendor: string;
              amount: number;
              status: string;
              description?: string;
              quantity: number;
              unitPrice: number;
              taxRate: number;
              totalAmount: number;
          }>;
          totalExpenses: number;
      }>;
      summary?: {
          totalAccounts: number;
          totalExpenses: number;
      };
  } | null;
}

export const createTransaction = async (data: ITransaction) => {
    try {
        const { accountId, payee, account, payment = 0, deposit = 0, bankMemo } = data;
        
        if (typeof payment !== 'number' || typeof deposit !== 'number') {
            return {
                success: false,
                message: 'Payment and deposit must be numbers',
                data: null
            };
        }
    
        const sourceAccount = await AccountModel.findById(accountId);
        if (!sourceAccount) {
            return {
                success: false,
                message: 'Account not found',
                data: null
            };
        }
    
        if (payment > 0 && sourceAccount.currentBalance < payment) {
            return {
                success: false,
                message: 'Insufficient balance',
                data: null
            };
        }
    
        const transaction = await Transaction.create({
            accountId,
            payee,
            account,
            payment,
            deposit,
            bankMemo,
            date: new Date(),
            action: 'Pending'
        });
    
        const balanceChange = deposit > 0 ? deposit : -payment;
        const updatedAccount = await AccountModel.findByIdAndUpdate(
            accountId,
            { $inc: { currentBalance: balanceChange } },
            { new: true }
        );
    
        return {
            success: true,
            message: 'Transaction created successfully',
            data: { transaction, updatedBalance: updatedAccount?.currentBalance }
        };
    
    } catch (error) {
        return {
            success: false,
            message: 'Error creating transaction',
            data: null
        };
    }
};


export const getTransactions = async () => {
    const result = await Transaction.find({});
    return result;
};


export const createFundTransfer = async (data: IFunds) => {
  try {
    const { fromAccount, toAccount, amount, date, bankMemo } = data;

    if (amount <= 0) {
      throw new Error("Transfer amount must be greater than zero.");
    }

    const sourceAccount = await AccountModel.findById(fromAccount);
    if (!sourceAccount) {
      throw new Error("Source account not found.");
    }
    if (sourceAccount.currentBalance < amount) {
      throw new Error("Insufficient balance in the source account.");
    }

    sourceAccount.currentBalance -= amount;
    await sourceAccount.save();

    const fundTransfer = new FundTransferModel({
      fromAccount,
      toAccount,
      amount,
      date: date || new Date(),
      bankMemo,
    });
    await fundTransfer.save();

    const debitTransaction = new Transaction({
      accountId: fromAccount,
      date: date || new Date(),
      payee: fromAccount, 
      bankMemo: bankMemo || "Fund transfer to another account",
      account: sourceAccount.accountType, 
      payment: amount, 
      deposit: 0, 
      action: "Approved",
    });
    await debitTransaction.save();

    const creditTransaction = new Transaction({
      accountId: toAccount, 
      date: date || new Date(),
      payee: fromAccount, 
      bankMemo: bankMemo || "Fund transfer received",
      account: "N/A",
      payment: 0, 
      deposit: amount, 
      action: "Approved",
    });
    await creditTransaction.save();

    return {
      success: true,
      message: "Fund transfer completed successfully with transactions recorded.",
      data: {
        fundTransfer,
        debitTransaction,
        creditTransaction,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error processing fund transfer.",
      data: null,
    };
  }
};


export const getAccountsAndExpenses = async (userId: string) => {
  try {
      const vendors = await VendorModel.findOne({ user:userId });
      if(!vendors){
        return {
          success: false,
          message: 'Error retrieving accounts and expenses',
          data: null
      };
      }
      const expenses = await ExpenseModel.find({ vendor:vendors._id , status:'pending'})
      const accounts= await AccountModel.find({})
      return {
          success: true,
          message: 'Data retrieved successfully',
          expenses,
          accounts  
      };
  } catch (error) {
      console.error('Error in getAccountsAndExpenses:', error);
      return {
          success: false,
          message: 'Error retrieving accounts and expenses',
          data: null
      };
  }
};


export const updateExpenseStatus = async (
  userId: string,
  data: { fromAccountId: string; toAccountId: string; amount: number; bankMemo: string }
) => {
  try {
    const { fromAccountId, toAccountId, amount, bankMemo } = data;

    if (!toAccountId || !fromAccountId || !amount || !bankMemo) {
      return {
        success: false,
        message: "Missing required fields: toAccountId, fromAccountId, amount, or bankMemo",
        data: null,
      };
    }

    const fromAccount = await AccountModel.findOne({ _id: fromAccountId });
    if (!fromAccount) {
      return {
        success: false,
        message: "Invalid fromAccount",
        data: null,
      };
    }

    if (fromAccount.currentBalance < amount) {
      return {
        success: false,
        message: "Insufficient balance in the fromAccount",
        data: null,
      };
    }

    const expense = await ExpenseModel.findById(toAccountId);
    if (expense) {
      const vendor = await VendorModel.findOne({ user: userId });
      if (!vendor) {
        return {
          success: false,
          message: "Vendor not found for the provided user ID",
          data: null,
        };
      }

      if (expense.vendor.toString() !== vendor._id.toString()) {
        return {
          success: false,
          message: "Expense does not belong to the vendor",
          data: null,
        };
      }

      if (expense.status !== "pending") {
        return {
          success: false,
          message: "Expense is not in a pending state",
          data: null,
        };
      }

      if (amount !== expense.amount) {
        return {
          success: false,
          message: "Provided amount does not match the expense amount",
          data: {
            providedAmount: amount,
            requiredAmount: expense.amount,
          },
        };
      }

      fromAccount.currentBalance = Number(fromAccount.currentBalance) - Number(amount);

      expense.status = "paid";

      await fromAccount.save();
      await expense.save();

      return {
        success: true,
        message: "Expense paid successfully",
        data: { expense, fromAccount },
      };
    } else {
      const toAccount = await AccountModel.findById(toAccountId);
      if (!toAccount) {
        return {
          success: false,
          message: "Invalid toAccount",
          data: null,
        };
      }

      console.log("Before Transfer:", {
        fromAccountBalance: fromAccount.currentBalance,
        toAccountBalance: toAccount.currentBalance,
        transferAmount: amount,
      });

      fromAccount.currentBalance = Number(fromAccount.currentBalance) - Number(amount);
      toAccount.currentBalance = Number(toAccount.currentBalance) + Number(amount);

      console.log("After Transfer:", {
        fromAccountBalance: fromAccount.currentBalance,
        toAccountBalance: toAccount.currentBalance,
      });

      await fromAccount.save();
      await toAccount.save();

      return {
        success: true,
        message: "Transfer completed successfully",
        data: { fromAccount, toAccount },
      };
    }
  } catch (error) {
    console.error("Error in updateExpenseStatus:", error);
    return {
      success: false,
      message: "An error occurred while processing the request",
      data: null,
    };
  }
};


