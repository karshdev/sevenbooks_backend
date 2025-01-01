import { Account } from "./banking.dto";
import { AccountModel } from "./banking.schema";



export const createAccount = async (data: Account) => {
    const result = await AccountModel.create({ ...data, active: true });
    return result;
};


export const updateAccount = async (data: Account , accountId:string) => {
    const result = await AccountModel.findOneAndUpdate({_id:accountId} , {...data});
    return result;
};

export const getAccounts = async () => {
    const result = await AccountModel.find({});
    return result;
};



