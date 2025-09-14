import { BudgetController } from "../../controllers/BudgetController"
import { budgets } from "../mocks/budgets"
import { createRequest, createResponse } from 'node-mocks-http'
import Budget from "../../models/Budget"
import Expense from "../../models/Expense"

jest.mock('../../models/Budget', () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
}))

describe('BudgetController.getAll', () => {

    beforeEach(() => {
        (Budget.findAll as jest.Mock).mockReset();
        (Budget.findAll as jest.Mock).mockImplementation((options) => {
            const updatedBudgets = budgets.filter(budget => budget.userId === options.where.userId);
            return Promise.resolve(updatedBudgets)
        })
    })

    it('should retrieve 2 budgets for user with ID 1', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 1 }
        })
        const res = createResponse();
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        expect(data).toHaveLength(2);
        expect(res.statusCode).toBe(200)
        expect(res.status).not.toBe(404)
    })

    it('should retrieve 1 budgets for user with ID 2', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 2 }
        })
        const res = createResponse();
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        expect(data).toHaveLength(1);
        expect(res.statusCode).toBe(200)
        expect(res.status).not.toBe(404)
    })

    it('should retrieve 0 budgets for user with ID 10', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 10 }
        })
        const res = createResponse();
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        expect(data).toHaveLength(0);
        expect(res.statusCode).toBe(200)
        expect(res.status).not.toBe(404)
    })

    it('should handle errors when fetching budgets', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 100 }
        })
        const res = createResponse();

        (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
        await BudgetController.getAll(req, res)

        expect(res.statusCode).toBe(500)
        expect(res._getJSONData()).toEqual({ error: 'Error fetching budgets' })
    })
})

describe('BudgetController.create', () => {
    it('Should create a new budget and respond with statusCode 201', async () => {

        const mockBudget = {
            save: jest.fn().mockResolvedValue(true)
        };

        (Budget.create as jest.Mock).mockResolvedValue(mockBudget)
        const req = createRequest({
            method: 'POST',
            url: '/api/create-budget',
            user: { id: 1 },
            body: { name: 'Presupuesto Prueba', amount: 1000 }
        })
        const res = createResponse();
        await BudgetController.create(req, res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(201)
        expect(data).toBe('Budget created succefully')
        expect(mockBudget.save).toHaveBeenCalled()
        expect(mockBudget.save).toHaveBeenCalledTimes(1)
        expect(Budget.create).toHaveBeenCalledWith(req.body)
    })

    it('Should handle budget creation error', async () => {

        const mockBudget = {
            save: jest.fn()
        };

        (Budget.create as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            method: 'POST',
            url: '/api/create-budget',
            user: { id: 1 },
            body: { name: 'Presupuesto Prueba', amount: 1000 }
        })
        const res = createResponse();
        await BudgetController.create(req, res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(500)
        expect(data).toEqual({ error: 'Error creating budget' })
        expect(mockBudget.save).not.toHaveBeenCalled()
        expect(Budget.create).toHaveBeenCalledWith(req.body)
    })
})

describe('BudgetController.getById', () => {

    beforeEach(() => {
        (Budget.findByPk as jest.Mock).mockImplementation((id) => {
            const budget = budgets.filter(b => b.id === id)[0]
            return Promise.resolve(budget)
        })
    })

    it('should return a budget with ID 1 and 3 expenses', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: { id: 1 },
        })
        const res = createResponse();
        await BudgetController.getById(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(3)
        expect(Budget.findByPk).toHaveBeenCalledTimes(1)
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
            include: [Expense]
        })
    })

    it('should return a budget with ID 2 and 2 expenses', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: { id: 2 },
        })
        const res = createResponse();
        await BudgetController.getById(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(2)
    })

    it('should return a budget with ID 3 and 0 expenses', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: { id: 3 },
        })
        const res = createResponse();
        await BudgetController.getById(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(0)
    })
})

describe('BudgetController.update', () => {
    it('should update the budget and return a success message', async () => {
        const budgetMock = {
            update: jest.fn().mockResolvedValue(true)
        }

        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId',
            budget: budgetMock,
            body: { name: 'Presupuesto Actualizado', amount: 5000 }
        })
        const res = createResponse();
        await BudgetController.update(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe("Budget updated")
        expect(budgetMock.update).toHaveBeenCalled()
        expect(budgetMock.update).toHaveBeenCalledTimes(1)
        expect(budgetMock.update).toHaveBeenCalledWith(req.body)
    })
})

describe('BudgetController.delete', () => {
    it('should delete the budget and return a success message', async () => {
        const budgetMock = {
            destroy: jest.fn().mockResolvedValue(true)
        }

        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId',
            budget: budgetMock,
        })
        const res = createResponse();
        await BudgetController.delete(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe("Budget deleted")
        expect(budgetMock.destroy).toHaveBeenCalled()
        expect(budgetMock.destroy).toHaveBeenCalledTimes(1)
    })
})