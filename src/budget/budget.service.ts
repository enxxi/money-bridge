import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
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
    // 예산을 설정하는 함수.
    try {
      await this.budgetRepository.createBudget(userId, budgetDto)

      return '예산 설정에 성공했습니다.'
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('예산 설정에 실패했습니다.')
    }
  }

  async updateBudget(budgetId, budgetDto: BudgetDto.Update) {
    try {
      const budget = await this.budgetRepository.findById(budgetId)
      if (!budget) {
        throw new NotFoundException('해당 id를 가진 예산을 찾을 수 없습니다.')
      }
      await this.budgetRepository.updateBudget(budgetId, budgetDto)

      return '예산 수정에 성공했습니다.'
    } catch (error) {
      throw new InternalServerErrorException('예산 수정에 실패했습니다.')
    }
  }
}
