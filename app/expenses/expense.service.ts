import { CreateExpensePayload } from "./expenses.dto";
import {VendorModel, ExpenseModel } from "./expenses.schema";

export const createExpense = async (data: CreateExpensePayload) => { 
  try {    
  
    const expenses = await Promise.all(
      data.expenses.map(async (expenseItem) => {
        let totalAmount = expenseItem.quantity * expenseItem.unitPrice;
        
        if (expenseItem.taxRate) {
            totalAmount += totalAmount * 0.20;
        }

        const expense = await ExpenseModel.create({
          ...expenseItem,
          vendor: data?.vendor?._id,
          amount: totalAmount
        });

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

