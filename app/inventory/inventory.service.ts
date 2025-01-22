
import { Inventory } from './inventory.dto';
import { InventoryModel } from './inventory.schema';


export const createInventory = async (userId: string, data: Inventory) => {
  try {
    const inventory = new InventoryModel({ ...data, user: userId });
    return await inventory.save();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error creating inventory entry");
  }
};

export const getInventory = async (userId: string) => {
  try {
    const inventory = await InventoryModel.find({ user: userId });
    return inventory
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error fetching inventory entry");
  }
};