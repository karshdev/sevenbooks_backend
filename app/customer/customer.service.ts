import { Types } from "mongoose";
import { Customer } from "./customer.dto";
import { CustomerModel } from "./customer.schema";

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