import { Module } from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { ExpensesController } from './expenses.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Expenses } from './entities/expenses.entity'
import { TypeOrmExModule } from 'src/common/decorator/typeorm-ex.module'
import { ExpensesRepository } from './expenses.repository'
import { BudgetRepository } from 'src/budget/budget.repository'
import { PassportModule } from '@nestjs/passport'
import { StatisticsService } from './statistics.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Expenses]),
    TypeOrmExModule.forCustomRepository([ExpensesRepository, BudgetRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ExpensesService, StatisticsService],
  controllers: [ExpensesController],
})
export class ExpensesModule {}
