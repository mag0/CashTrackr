import { Table, Column, Model, HasMany, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Expense from './Expense';

@Table({ tableName: 'budgets' })

class Budget extends Model<Budget> {
    @Column({ type: DataType.STRING(100) })
    declare name: string;

    @Column({ type: DataType.DECIMAL })
    declare amount: number;

    @HasMany(() => Expense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expenses: Expense[];

}

export default Budget;