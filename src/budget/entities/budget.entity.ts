import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Expenses } from 'src/expenses/entities/expenses.entity'
import { User } from 'src/user/entities/user.entity'
import { Category } from 'src/category/entities/category.entity'

@Entity()
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  year: number

  @Column()
  month: number

  @Column()
  total: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.budgets)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Category, (category) => category.budgets)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @OneToMany(() => Expenses, (expenses) => expenses.budget)
  expenses: Expenses[]
}
