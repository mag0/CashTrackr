import type { Request, Response } from 'express'
import User from '../models/User';
import { checkPasswords, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';

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

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.confirmed) {
            return res.status(401).json({ error: 'Account not confirmed' });
        }

        const isPasswordCorrect = await checkPasswords(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateJWT(user.id);

        res.json({ token });
    }

    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a password reset token
        const token = generateToken();
        user.token = token;
        await user.save();

        // Send the password reset email
        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token
        });

        res.json({ message: 'Password reset email sent' });
    }

    static validateToken = async (req: Request, res: Response) => {
        const { token } = req.body;

        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(404).json({ error: 'Invalid token' });
        }

        res.json({ message: 'Token is valid' });
    }

    static resetPassword = async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(404).json({ error: 'Invalid token' });
        }

        user.password = await hashPassword(password);
        user.token = null;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    }

    static getUser = async (req: Request, res: Response) => {
        res.json(req.user);
    }
}