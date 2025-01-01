import mongoose, { Schema } from "mongoose";
import { Account, AccountType, FundTransfer } from "./banking.dto" 
      
 const accountSchema = new Schema<Account>({
        accountName: { type: String, required: true, trim: true },
        accountNumber: { type: String, required: true, unique: true, trim: true },
        openingBalance: { type: Number, required: true, default: 0 },
        currentBalance: {
          type: Number,
          required: true,
          default: function () {
            return this.openingBalance;
          },
        },
        branchId: { type: String, required: true, trim: true },
        accountType: { type: String, enum: Object.values(AccountType), required: true },
        isActive: { type: Boolean, default: true },
        creditLimit: {
          type: Number,
          required: function () {
            return this.accountType === AccountType.CREDIT_CARD || this.accountType === AccountType.LOAN;
          },
        },
        interestRate: {
          type: Number,
          required: function () {
            return this.accountType === AccountType.CREDIT_CARD || this.accountType === AccountType.LOAN;
          },
        },
        dueDate: {
          type: Date,
          required: function () {
            return this.accountType === AccountType.CREDIT_CARD || this.accountType === AccountType.LOAN;
          },
        },
        minimumPayment: {
          type: Number,
          required: function () {
            return this.accountType === AccountType.CREDIT_CARD || this.accountType === AccountType.LOAN;
          },
        },
      });


const fundTransferSchema = new Schema({
  date: { type: Date, required: true, default: Date.now },
  fromAccount: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  toAccount: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
});


export const FundTransferModel = mongoose.model<FundTransfer>('FundTransfer', fundTransferSchema);
export const AccountModel = mongoose.model<Account>('Account', accountSchema);
      