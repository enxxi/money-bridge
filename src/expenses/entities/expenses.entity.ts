import { Budget } from 'src/budget/entities/budget.entity'
import { Category } from 'src/category/entities/category.entity'
import { User } from 'src/user/entities/user.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Expenses extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  amount: number

  @Column()
  date: Date

  @Column({ length: 50 })
  description: string

  @Column({ default: false })
  isExcluded: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.expenses)
  user: User

  @ManyToOne(() => Category, (category) => category.expenses)
  category: Category

  @ManyToOne(() => Budget, (budget) => budget.expenses)
  budget: Budget
}
