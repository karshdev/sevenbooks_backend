import mongoose, { Schema } from "mongoose";
import { Customer } from "./customer.dto";

const customerSchema = new Schema<Customer>({
  type: {
    type: String,
    enum: ['regular', 'business'],
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String, 
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  provinceState: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  balance: {
    type: Number,

  }
}, {
  timestamps: true
});

customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ type: 1 });
customerSchema.index({ companyName: 1 });
customerSchema.index({ user: 1 });

export const CustomerModel = mongoose.model<Customer>('Customer', customerSchema);
