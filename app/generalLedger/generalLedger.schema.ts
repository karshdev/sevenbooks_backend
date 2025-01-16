import mongoose, { Schema } from "mongoose";
import { ChartOfAccounts } from "./generalLedger.dto";

const chartOfAccount = new Schema<ChartOfAccounts>({

  accountName: {
    type: String,
    required: true
  },
  
  accountType: {
    type: String,
    required: true
  },

  detailType: {
    type: String,
    required: true
  },
  openingBalance: {
    type: Number,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  timestamps: true
});


export const ChartModel = mongoose.model<ChartOfAccounts>('ChartOfAccounts', chartOfAccount);
