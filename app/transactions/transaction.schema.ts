import {  Schema, Types, model } from "mongoose";
import { ITransaction } from "./transaction.dto";





const TransactionSchema = new Schema<ITransaction>({
  accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  date: { type: Date, required: true, default: Date.now },
  payee: { type: String, required: true, trim: true },
  bankMemo: { type: String, trim: true },
  account: {
    type: String,
    enum: ["checking", "cash", "credit_card", "loan"],
    required: true,
    trim: true,
  },
  payment: { type: Number, default: 0, min: 0 },
  deposit: { type: Number, default: 0, min: 0 },
  action: { type: String, enum: ["Approved", "Pending", "Rejected"], default: "Pending" },
});

export const Transaction = model<ITransaction>("Transaction", TransactionSchema);
