import mongoose, { Types } from "mongoose";
import { Customer } from "./customer.dto";
import { CustomerModel } from "./customer.schema";
import { InvoiceStatus } from "../invoices/invoices.dto";
import { InvoiceModel } from "../invoices/invoices.schema";

export const createCustomer = async (data: Omit<Customer, 'user'>, userId: string) => {
  try {
    const customerExists = await CustomerModel.findOne({ 
      email: data.email,
      user: new Types.ObjectId(userId)
    });

    if (customerExists) {
      throw new Error('Customer with this email already exists');
    }

    const customer = new CustomerModel({
      ...data,
      user: new Types.ObjectId(userId)
    });

    const result = await customer.save();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error creating customer');
  }
};

export const getCustomer = async (userId: string) => {
  try {
    const customers = await CustomerModel.find({ 
      user: new Types.ObjectId(userId) 
    }).sort({ createdAt: -1 });
    return customers;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error fetching customers');
  }
};
export const getTopCustomer = async (userId: string) => {
  try {
    const today = new Date();

    const customerExists = await CustomerModel.exists({ user: userId });
    if (!customerExists) {
      throw new Error('No customers found for this user');
    }
    const customerMetrics = await InvoiceModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      
      {
        $group: {
          _id: "$customer",
          totalBalance: { $sum: "$total" },
          invoiceCount: { $sum: 1 },
          
          overDueAmount: {
            $sum: {
              $cond: [
                { $and: [
                  { $lt: ["$dueDate", today] },
                  { $ne: ["$status", InvoiceStatus.DRAFT] }
                ]},
                "$total",
                0
              ]
            }
          },
          
          withinDueAmount: {
            $sum: {
              $cond: [
                { $and: [
                  { $gte: ["$dueDate", today] },
                  { $ne: ["$status", InvoiceStatus.DRAFT] }
                ]},
                "$total",
                0
              ]
            }
          },
          
          invoices: {
            $push: {
              invoiceNumber: "$invoiceNumber",
              status: "$status",
              total: "$total",
              dueDate: "$dueDate",
              invoiceDate: "$invoiceDate"
            }
          }
        }
      },
      
      { $sort: { overDueAmount: -1 } },
      
      { $limit: 10 },
      
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customerDetails"
        }
      },
      
      { $unwind: "$customerDetails" },
      
      {
        $project: {
          _id: 1,
          customer: "$customerDetails",
          balance: "$totalBalance",
          withinDue: "$withinDueAmount",
          overDue: "$overDueAmount",
          overDuePercentage: {
            $multiply: [
              {
                $cond: [
                  { $eq: ["$totalBalance", 0] },
                  0,
                  { $divide: ["$overDueAmount", "$totalBalance"] }
                ]
              },
              100
            ]
          },
          invoiceCount: 1,
          invoices: 1,
          creditLimit: { $ifNull: ["$customerDetails.creditLimit", 0] }
        }
      }
    ]);
 if (!customerMetrics || customerMetrics.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No customer data available'
      };
    }
    // Format the response
    const formattedCustomers = customerMetrics.map(customer => ({
      customerId: customer._id,
      customerName: 
        customer.customer.firstName,
      balance: Number(customer.balance.toFixed(2)),
      withinDue: Number(customer.withinDue.toFixed(2)),
      overDue: Number(customer.overDue.toFixed(2)),
      overDuePercentage: Number(customer.overDuePercentage.toFixed(2)),
      invoiceCount: customer.invoiceCount,
      creditLimit: Number(customer.creditLimit.toFixed(2)),
      invoices: customer.invoices
    }));

    return {
      success: true,
      data: formattedCustomers,
      message: 'Customers fetched successfully'
    };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error fetching customers');
  }
};

export const getCustomerById = async (customerId: string, userId: string) => {
  try {
    const customer = await CustomerModel.findOne({
      _id: new Types.ObjectId(customerId),
      user: new Types.ObjectId(userId)
    });
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    return customer;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error fetching customer');
  }
};

export const updateCustomer = async (
  customerId: string, 
  userId: string, 
  data: Partial<Omit<Customer, 'user'>>
) => {
  try {
    const customer = await CustomerModel.findOneAndUpdate(
      { 
        _id: new Types.ObjectId(customerId), 
        user: new Types.ObjectId(userId) 
      },
      { $set: data },
      { new: true }
    );

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error updating customer');
  }
};

export const deleteCustomer = async (customerId: string, userId: string) => {
  try {
    const customer = await CustomerModel.findOneAndDelete({
      _id: new Types.ObjectId(customerId),
      user: new Types.ObjectId(userId)
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error deleting customer');
  }
};