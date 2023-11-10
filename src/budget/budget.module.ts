import { Module } from '@nestjs/common'
import { BudgetController } from './budget.controller'
import { BudgetService } from './budget.service'
import { TypeOrmExModule } from 'src/common/decorator/typeorm-ex.module'
import { BudgetRepository } from './budget.repository'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Budget } from './entities/budget.entity'
import { UserRepository } from 'src/user/user.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget]),
    TypeOrmExModule.forCustomRepository([BudgetRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
