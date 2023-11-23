import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { Budget } from 'src/budget/entities/budget.entity'
import { Expenses } from 'src/expenses/entities/expenses.entity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ length: 30, unique: true })
  email: string

  @Column()
  password: string

  @Column({ length: 20, unique: true })
  username: string

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[]

  @OneToMany(() => Expenses, (expenses) => expenses.user)
  expenses: Expenses[]
}
