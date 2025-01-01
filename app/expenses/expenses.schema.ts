import mongoose, { Schema, Types } from 'mongoose';
import { BaseSchema } from '../common/dto/base.dto';
import { Expense, Vendor } from './expenses.dto';



const vendorSchema = new Schema<Vendor>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  address: { type: String, required: true, trim: true },
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  taxId: { type: String, required: true, trim: true },
});


const expenseSchema = new Schema<Expense>({
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  description: { type: String, trim: true },
  quantity: { type: Number, required:true },
  unitPrice: { type: Number, required:true },
  taxRate: {
    type: Number,
    required: true,
  },
});

export const VendorModel = mongoose.model<Vendor>('Vendor', vendorSchema);
export const ExpenseModel = mongoose.model<Expense>('Expense', expenseSchema);
