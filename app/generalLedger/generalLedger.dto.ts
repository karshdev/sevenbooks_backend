
import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

   export interface ChartOfAccounts extends BaseSchema {
        accountName: string;
        accountType: string;
        detailType: string;
        description: string;
        openingBalance: number;
        status: string ;
        user: Types.ObjectId;
      }
