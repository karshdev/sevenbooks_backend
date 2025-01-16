import { AccountModel } from "../banking/banking.schema";
import { Transaction } from "../transactions/transaction.schema";
import { CreateExpensePayload } from "./expenses.dto";
import {VendorModel, ExpenseModel } from "./expenses.schema";
interface PayExpenseRequest {
  expenses: Array<{
    expenseId: string;
    amountToPay: number;
  }>;
  accountId: string;
}
export const createExpense = async (data: CreateExpensePayload) => { 
try {    
  console.log("Data",data);
  
  const expenses = await Promise.all(
    data.expenses.map(async (expenseItem) => {
      let totalAmount = expenseItem.quantity * expenseItem.unitPrice;
      
      if (expenseItem.taxRate) {
        totalAmount += totalAmount * 0.20;
      }
  
      const expenseData :any = {
        ...expenseItem,
        vendor: data?.vendor?._id,
        amount: totalAmount,
      };
  
      if (data.chartOfAccounts) {
        expenseData.chartOfAccounts = data.chartOfAccounts;
      }
  
      const expense = await ExpenseModel.create(expenseData);
      return expense;
    })
  );
  

  return {
    expenses
  };
} catch (error) {
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error('Error creating expenses');
}
};


export const calculateExpensesTotal = (expenses: Array<{
  quantity: number;
  unitPrice: number;
  taxRate: number
}>) => {
  return expenses.reduce((total, expense) => {
    let itemTotal = expense.quantity * expense.unitPrice;
    
    if (expense.taxRate) {
        itemTotal += itemTotal * 0.18;
    }
    
    return total + itemTotal;
  }, 0);
};

export const getExpenseById = async (vendorId: string, userId: string) => {
  try {
    const vendor = await VendorModel.findOne({ _id: vendorId, user: userId });
     console.log("vendor",vendor);
     
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    const expenses = await ExpenseModel.find({ vendor: vendor._id });

    return {
      vendor,
      expenses
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error fetching expenses');
  }
};

export const getExpenses = async (userId: string) => {
  try {
    const vendors = await VendorModel.find({ user: userId });

    if (!vendors.length) {
      throw new Error('No vendors found for the given user');
    }

    const expensesPromises = vendors.map(async (vendor) => {
      const expenses = await ExpenseModel.find({ vendor: vendor._id });
      return { vendor, expenses };
    });

    const vendorExpenses = await Promise.all(expensesPromises);

    return vendorExpenses;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error fetching expenses');
  }
};

export const payExpenses = async (data: PayExpenseRequest, userId: string) => {
  try {
    const { expenses, accountId } = data;

    const account = await AccountModel.findOne({ _id: accountId });
    if (!account) {
      throw new Error('Account not found');
    }

    const totalPayment = expenses.reduce((sum, exp) => sum + exp.amountToPay, 0);
    if (account.currentBalance < totalPayment) {
      throw new Error('Insufficient balance');
    }

    // Update account balance
    const updatedAccount = await AccountModel.findOneAndUpdate(
      { _id: accountId },
      { $inc: { currentBalance: -totalPayment } },
      { new: true }
    );

    // Process each expense and create corresponding transactions
    const [expenseUpdates, transactions] = await Promise.all([
      // Update expenses
      Promise.all(
        expenses.map(async ({ expenseId, amountToPay }) => {
          const expense = await ExpenseModel.findById(expenseId);
          if (!expense) {
            throw new Error(`Expense ${expenseId} not found`);
          }

          // If full amount paid, mark as paid
          const status = amountToPay >= expense.amount ? 'paid' : 'pending';
          
          return ExpenseModel.findByIdAndUpdate(
            expenseId,
            {
              $set: { status },
              $inc: { amount: -amountToPay }
            },
            { new: true }
          );
        })
      ),
      
      // Create transactions
      Promise.all(
        expenses.map(async ({ expenseId, amountToPay }) => {
          const expense = await ExpenseModel.findById(expenseId);
          if (!expense) {
            throw new Error(`Expense ${expenseId} not found`);
          }

          const transaction = new Transaction({
            accountId: accountId,
            date: new Date(),
            payee: expenseId,  // Reference to the expense
            bankMemo: `Payment for expense: ${expense.description || 'No description'}`,
            account: account.accountType.toLowerCase(), // Convert account type to match enum
            payment: amountToPay,
            deposit: 0,
            action: "Approved"  // Since this is an immediate payment
          });

          return transaction.save();
        })
      )
    ]);

    return {
      expenses,
      account: updatedAccount,
      updatedExpenses: expenseUpdates,
      transactions: transactions
    };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error processing expense payments');
  }
};


