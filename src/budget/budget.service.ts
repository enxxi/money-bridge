import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BudgetRepository } from './budget.repository'
import { BudgetDto } from './dto/budgetDto'
import { UserRepository } from 'src/user/user.repository'

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetRepository)
    private budgetRepository: BudgetRepository,
  ) {}

  async createBudget(budgetDto: BudgetDto.Create, userId: string) {
    try {
      await this.budgetRepository.createBudget(userId, budgetDto)

      return '예산 설정에 성공했습니다.'
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('예산 설정에 실패했습니다.')
    }
  }
}
