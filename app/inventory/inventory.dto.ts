import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface Inventory extends BaseSchema {
  partNumber: string;
  itemName: string;
  description: string;
  groupNumber: string;
  groupName: string;
  sellingPrice: number;
  cost: number;
  storeLocation: string;
  vendor: Types.ObjectId;
  user: Types.ObjectId;
}
