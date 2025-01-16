
import { AccountModel } from "../banking/banking.schema";
import { CustomerModel } from "../customer/customer.schema";
import { Invoice, InvoiceQueryParams, InvoiceStatus } from "./invoices.dto";
import { InvoiceModel } from "./invoices.schema";

   export const createInvoice = async (data: Invoice, userId:string) => {
    try {
      const invoiceData: Partial<Invoice> = {
        ...data,
        user: userId,
        status: InvoiceStatus.DRAFT
      };
  
      const invoice = await InvoiceModel.create(invoiceData);
      await invoice.populate('customer');
      
      return {
        data:invoice,
      }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('Error fetching expenses');
        }
    }
   

    export const getAllInvoices = async (queryParams: InvoiceQueryParams, userId: string) => {
        try {
            const { status, customer, startDate, endDate } = queryParams;
            const query: Record<string, any> = { user: userId };
            
            if (status) query.status = status;
            if (customer) query.customer = customer;
            if (startDate && endDate) {
                query.invoiceDate = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
        
            const invoices = await InvoiceModel
                .find(query)
                .populate('customer')
                .sort({ createdAt: -1 })
                .lean();
            
            return {
                data: invoices
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Error fetching invoices');
        }
    };
  

    export const payInvoices = async (data: { invoiceId: Invoice[], accountId: string, customerId: string }, userId: string) => {
        try {
            const { invoiceId, accountId, customerId } = data;
            let totalAmount = 0;
            const updatedInvoices = [];
    
            // Find both account and customer
            const [account, customer] = await Promise.all([
                AccountModel.findById(accountId),
                CustomerModel.findById(customerId)
            ]);
    
            if (!account) {
                throw new Error('Account not found');
            }
    
            if (!customer) {
                throw new Error('Customer not found');
            }
    
            for (const invoiceData of invoiceId) {
                const invoice = await InvoiceModel.findOne({ invoiceNumber: invoiceData.invoiceNumber });
                if (!invoice) {
                    console.warn(`Invoice ${invoiceData.invoiceNumber} not found, skipping`);
                    continue;
                }
    
                if (invoice.status === InvoiceStatus.PAID) {
                    console.warn(`Invoice ${invoiceData.invoiceNumber} is already paid, skipping`);
                    continue;
                }
    
                invoice.status = InvoiceStatus.PAID;
                invoice.dueDate = new Date();
                await invoice.save();
    
                totalAmount += invoice.total;
                updatedInvoices.push(invoice);
            }
    
            if (updatedInvoices.length === 0) {
                throw new Error('No valid invoices to process');
            }
    
            // Update both account and customer balances
            account.currentBalance += totalAmount;
            customer.balance = (customer.balance || 0) + totalAmount;
    
            // Save both updates
            await Promise.all([
                account.save(),
                customer.save()
            ]);
    
            return {
                message: `Successfully paid ${updatedInvoices.length} invoices`,
                invoices: updatedInvoices,
                account,
                customer
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Error processing payment');
        }
    };