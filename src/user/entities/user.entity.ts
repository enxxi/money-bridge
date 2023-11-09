import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { IsEmail } from 'class-validator'
import { Budget } from 'src/budget/entities/budget.entity'

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
}
