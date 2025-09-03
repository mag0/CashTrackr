import type { Request, Response } from 'express'
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        try {
            const user = new User(req.body);
            user.password = await hashPassword(password);
            user.token = generateToken();
            await user.save();

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            });

            res.json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body;

        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        user.confirmed = true;
        user.token = null;
        await user.save();

        res.json({ message: 'Account confirmed successfully' });
    }
}