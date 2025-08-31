import { Table, Column, Model, HasMany, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({ tableName: 'budgets' })

class Budget extends Model<Budget> {
    @Column({ type: DataType.STRING(100) })
    declare name: string;

    @Column({ type: DataType.DECIMAL })
    declare amount: number;

}

export default Budget;