import mongoose, { Schema } from "mongoose";
import { Inventory } from "./inventory.dto";

const inventory = new Schema<Inventory>({

  partNumber: {
    type: String,
    required: true
  },
  
  itemName: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  groupNumber: {
    type: String,
    required: true
  },

  groupName: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },

  sellingPrice: {
    type: Number,
    required: true
  },
  storeLocation: {
    type: String,

    required: true
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  timestamps: true
});


export const InventoryModel = mongoose.model<Inventory>('inventory', inventory);
