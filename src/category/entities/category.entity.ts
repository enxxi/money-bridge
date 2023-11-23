import { Budget } from 'src/budget/entities/budget.entity'
import { Expenses } from 'src/expenses/entities/expenses.entity'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { CategoryName } from '../types/category.enum'

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: CategoryName, unique: true })
  name: CategoryName

  @OneToMany(() => Budget, (budget) => budget.category)
  budgets: Budget[]

  @OneToMany(() => Expenses, (expenses) => expenses.category)
  expenses: Expenses[]
}
