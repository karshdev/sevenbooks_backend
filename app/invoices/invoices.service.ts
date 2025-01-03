
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
  