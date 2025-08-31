import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { validateBudgetInput, validateBudgetExists, validateBudgetId } from "../middleware/budget";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);

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

export default router;