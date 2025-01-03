import mongoose, { Schema } from "mongoose";
import {  InvoiceStatus, InvoiceTerms, LineItem, TaxInfo } from "./invoices.dto";
 interface Invoice {
        user: Schema.Types.ObjectId;
        customer: Schema.Types.ObjectId;
        invoiceNumber: string;
        status: InvoiceStatus;
        terms: InvoiceTerms;
        invoiceDate: Date;
        dueDate: Date;
        billingAddress: string;
        lineItems: LineItem[];
        tax: TaxInfo;
        subtotal: number;
        taxAmount: number;
        total: number;
        notes?: string;
        createdAt?: Date;
        updatedAt?: Date;
      }
      
      const lineItemSchema = new Schema<LineItem>({
        description: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        rate: { type: Number, required: true, min: 0 },
        amount: { type: Number, required: true, min: 0 }
      });
      
      const taxInfoSchema = new Schema<TaxInfo>({
        rate: { type: Number, required: true, min: 0, max: 100 },
        region: { 
          type: String, 
          required: true,
          enum: ['CA-ON', 'CA-BC', 'CA-AB', 'US-NY', 'US-CA'] 
        }
      });
      
      const invoiceSchema = new Schema<Invoice>({
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
          index: true
        },
        customer: {
          type: Schema.Types.ObjectId,
          ref: 'Customer',
          required: true,
          index: true
        },
        invoiceNumber: {
          type: String,
          required: true,
          unique: true,
          index: true
        },
        status: {
          type: String,
          enum: Object.values(InvoiceStatus),
          default: InvoiceStatus.DRAFT,
          required: true,
          index: true
        },
        terms: {
          type: String,
          enum: Object.values(InvoiceTerms),
          required: true
        },
        invoiceDate: {
          type: Date,
          required: true,
          index: true
        },
        dueDate: {
          type: Date,
          required: true,
          index: true
        },
        billingAddress: {
          type: String,
          required: true
        },
        lineItems: {
          type: [lineItemSchema],
          required: true,
          validate: [
            {
              validator: (items: LineItem[]) => items.length > 0,
              message: 'At least one line item is required'
            }
          ]
        },
        tax: {
          type: taxInfoSchema,
          required: true
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0
        },
        taxAmount: {
          type: Number,
          required: true,
          min: 0
        },
        total: {
          type: Number,
          required: true,
          min: 0
        },
        notes: {
          type: String
        }
      }, {
        timestamps: true
      });
      
      invoiceSchema.pre('save', function(next) {
        this.subtotal = this.lineItems.reduce((sum, item) => 
          sum + (item.quantity * item.rate), 0);
        
        this.taxAmount = this.subtotal * (this.tax.rate / 100);
        
        this.total = this.subtotal + this.taxAmount;
        
        next();
      });
      
      invoiceSchema.pre('save', async function(next) {
        if (this.isNew) {
          const InvoiceModel = mongoose.model<Invoice>('Invoice');
          const lastInvoice = await InvoiceModel.findOne({}, {}, { sort: { 'invoiceNumber': -1 } });
          const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.slice(3)) : 0;
          this.invoiceNumber = `INV${(lastNumber + 1).toString().padStart(6, '0')}`;
        }
        next();
      }); 
      
      export const InvoiceModel = mongoose.model<Invoice>('Invoice', invoiceSchema);
      