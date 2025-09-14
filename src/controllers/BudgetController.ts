import type { Request, Response } from 'express';
import Budget from '../models/Budget';
import Expense from '../models/Expense';

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    userId: req.user.id
                }
            });
            res.json(budgets);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching budgets' });
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.create(req.body);
            budget.userId = req.user.id
            await budget.save()
            res.status(201).json('Budget created succefully');
        } catch (error) {
            res.status(500).json({ error: 'Error creating budget' });
        }
    }

    static getById = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        });

        res.json(budget);
    }

    static update = async (req: Request, res: Response) => {
        await req.budget.update(req.body);
        res.json("Budget updated");
    }

    static delete = async (req: Request, res: Response) => {
        await req.budget.destroy();
        res.json('Budget deleted');
    }
}