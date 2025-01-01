import { Vendor } from "../expenses/expenses.dto";
import { VendorModel } from "../expenses/expenses.schema";



export const createVendor = async (data: Vendor, userId: string) => {
    console.log("USER ID" , userId);
    
    const result = await VendorModel.create({ ...data, user: userId });
    return result;
};

export const getVendors = async (userId: string) => {
    const vendors = await VendorModel.find({ user: userId });
    return vendors;
};

export const getVendorById = async (vendorId: string, userId: string) => {
    const vendor = await VendorModel.findOne({ 
        _id: vendorId,
        user: userId 
    });
    return vendor;
};


