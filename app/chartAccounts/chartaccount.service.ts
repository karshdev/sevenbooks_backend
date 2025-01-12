import mongoose from "mongoose";
import { ChartOfAccounts } from "./chartaccount.dto";
import { ChartModel } from "./chartaccount.schema";

export const createChartOfAccounts = async (data: ChartOfAccounts, userId: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const chartAccount = new ChartModel({
      ...data,
      user: userId
    });

    const result = await chartAccount.save();

    return result

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error creating chart of accounts');
  }
};

export const getChartOfAccounts = async (userId: string, query: { 
  search?: string,
  accountType?: string,
  accountName?: string
}) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    let filterQuery: any = { user: userId };

    if (query.search) {
      filterQuery.$or = [
        { accountName: { $regex: query.search, $options: 'i' } },
        { accountType: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ];
    }

    if (query.accountType) {
      filterQuery.accountType = query.accountType;
    }
    if (query.accountName) {
      filterQuery.accountName = query.accountName;
    }

    const accounts = await ChartModel
      .find(filterQuery)
      .select('-user -updatedAt -__v')
      .lean()
      .exec();

    if (!accounts) {
      return [];
    }

    return accounts;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error fetching chart of accounts');
  }
};
