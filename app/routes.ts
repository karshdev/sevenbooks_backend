import express from "express";
import bankRoutes from "./banking/banking.route";
import userRoutes from "./user/user.route";
import transactionRoutes from "./transactions/transaction.route";
import expenseRoutes from "./expenses/expenses.route"
import customerRoutes  from "./customer/customer.route"
import vendorRoutes  from "./vendor/vendor.route"





// routes
const router = express.Router();

router.use("/users", userRoutes);
router.use("/account", bankRoutes);
router.use("/transactions", transactionRoutes);
router.use("/expense", expenseRoutes);
router.use("/customer", customerRoutes);
router.use("/vendor", vendorRoutes);

export default router;