import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { IsEmail } from 'class-validator'
import { Budget } from 'src/budget/entities/budget.entity'
import { Expenses } from 'src/expenses/entities/expenses.entity'

@Entity()
@Unique(['nickname', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @IsEmail()
  @Column({ length: 50 })
  email: string

  @Column()
  password: string

  @Column({ length: 10 })
  nickname: string

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[]

  @OneToMany(() => Expenses, (expenses) => expenses.user)
  expenses: Expenses[]
}
