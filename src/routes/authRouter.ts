import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";

const router = Router();

router.post('/register',
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    limiter,
    body('token').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Invalid token'),
    handleInputErrors,
    AuthController.confirmAccount
);

export default router;