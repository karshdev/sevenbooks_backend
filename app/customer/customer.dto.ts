
import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

   export interface Customer extends BaseSchema {
        type: 'regular' | 'business';
        firstName: string;
        companyName: string;
        email: string;
        phone: string;
        address: string ;
        city:string;
        postalCode:string;
        provinceState:string;
        country:string;
        balance:number;

        user: Types.ObjectId;
      }
