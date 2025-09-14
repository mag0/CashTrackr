import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { validateBudgetInput, validateBudgetExists, validateBudgetId, hasAccess } from "../middleware/budget";
import { handleInputErrors } from "../middleware/validation";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseExists, validateExpenseId, validateExpenseInput } from "../middleware/expense";
import { authenticate } from "../middleware/auth";
import Budget from "../models/Budget";

const router = Router();

router.use(authenticate)

/** Routes for Budgets */

router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);
router.param('budgetId', hasAccess)

router.param('expenseId', validateExpenseId);
router.param('expenseId', validateExpenseExists);

router.get('/', BudgetController.getAll);

router.post('/',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create
);

router.get('/:budgetId', BudgetController.getById);

router.put('/:budgetId',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.update
);

router.delete('/:budgetId', BudgetController.delete);


/** Routes for Expenses */

router.post('/:budgetId/expenses',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create);

router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById);

router.put('/:budgetId/expenses/:expenseId',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateById
);

router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById);

export default router;