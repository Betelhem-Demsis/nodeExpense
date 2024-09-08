const router = require("express").Router();
const incomeController = require("../controllers/incomeController");
const expenseController = require("../controllers/expenseController");

router
  .post("/add-income", incomeController.createIncome)
  .get("/get-incomes", incomeController.getIncomes)
  .delete("/delete-income/:id", incomeController.deleteIncome)
  .post("/add-expense", expenseController.createExpense)
  .get("/get-expenses", expenseController.getExpense)
  .delete("/delete-expense/:id", expenseController.deleteExpense);
  
module.exports = router;
