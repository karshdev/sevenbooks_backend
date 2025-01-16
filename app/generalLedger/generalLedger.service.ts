
import { PipelineStage } from 'mongoose';
import { Transaction } from '../transactions/transaction.schema';
import { ExpenseModel } from '../expenses/expenses.schema';

interface GeneralLedgerEntry {
  account: string;
  date: Date;
  transactionType: string;
  number: string;
  name: string;
  memo: string;
  amount: number;
  balance: number;
}

export const getAllGeneralLedger = async (userId: string, query: { 
  search?: string,
  accountType?: string,
  accountName?: string
}) => {
  try {
    const transactionPipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'accounts',
          localField: 'accountId',
          foreignField: '_id',
          as: 'accountData'
        }
      },
      {
        $unwind: '$accountData'
      },
      {
        $project: {
          account: '$accountData.accountName',
          date: { $ifNull: ['$date', new Date()] }, // Ensure date exists
          transactionType: {
            $cond: {
              if: { $eq: ['$deposit', 0] },
              then: 'Payment',
              else: 'Deposit'
            }
          },
          number: '$accountData.accountNumber',
          name: '$payee',
          memo: { $ifNull: ['$bankMemo', ''] },
          amount: {
            $cond: {
              if: { $eq: ['$deposit', 0] },
              then: '$payment',
              else: '$deposit'
            }
          },
          balance: '$accountData.currentBalance',
          sourceType: 'bank',
          createdAt: { $ifNull: ['$createdAt', new Date()] }
        }
      }
    ];

    const expensePipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorData'
        }
      },
      {
        $unwind: '$vendorData'
      },
      {
        $lookup: {
          from: 'chartofaccounts',
          localField: 'chartOfAccounts',
          foreignField: '_id',
          as: 'chartData'
        }
      },
      {
        $unwind: '$chartData'
      },
      {
        $project: {
          account: '$chartData.accountName',
          date: { $ifNull: ['$date', '$createdAt'] }, // Use createdAt as fallback
          transactionType: 'Expense',
          number: { $toString: '$_id' },
          name: '$vendorData.name',
          memo: '$description',
          amount: {
            $multiply: ['$quantity', '$unitPrice', { $add: [1, { $ifNull: ['$taxRate', 0] }] }]
          },
          balance: '$chartData.openingBalance',
          sourceType: 'chart',
          createdAt: { $ifNull: ['$createdAt', new Date()] }
        }
      }
    ];

    // Add your existing filter conditions here...
    if (query.search) {
      const searchStage: PipelineStage.Match = {
        $match: {
          $or: [
            { account: { $regex: query.search, $options: 'i' } },
            { name: { $regex: query.search, $options: 'i' } },
            { memo: { $regex: query.search, $options: 'i' } }
          ]
        }
      };
      transactionPipeline.push(searchStage);
      expensePipeline.push(searchStage);
    }

    // Execute both pipelines
    const [transactions, expenses] = await Promise.all([
      Transaction.aggregate(transactionPipeline),
      ExpenseModel.aggregate(expensePipeline)
    ]);

    // Combine and sort results using createdAt
    const combinedResults = [...transactions, ...expenses]
      .sort((a, b) => {
        const dateA = a.createdAt || new Date(0);
        const dateB = b.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

    // Format final results
    const formattedResults: GeneralLedgerEntry[] = combinedResults.map(entry => ({
      account: entry.account,
      date: entry.date || entry.createdAt || new Date(),
      transactionType: entry.transactionType,
      number: entry.number,
      name: entry.name,
      memo: entry.memo || '',
      amount: entry.amount,
      balance: entry.balance
    }));

    return formattedResults;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error fetching general ledger entries');
  }
};