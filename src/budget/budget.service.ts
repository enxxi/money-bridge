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
      // 각 카테고리에 대해 예산을 설정
      for (const [categoryId, budget] of Object.entries(
        budgetDto.categoryBudgets,
      )) {
        await this.budgetRepository.createBudget(
          userId,
          budgetDto.year,
          budgetDto.month,
          Number(categoryId),
          budget,
        )
      }

      return '예산 설정에 성공했습니다.'
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('예산 설정에 실패했습니다.')
    }
  }

  async updateBudget(budgetId: number, budgetDto: BudgetDto.Update) {
    // 예산을 수정하는 함수
    try {
      const budget = await this.budgetRepository.findById(budgetId)
      if (!budget) {
        throw new NotFoundException('해당 id를 가진 예산을 찾을 수 없습니다.')
      }
      await this.budgetRepository.updateBudget(budgetId, budgetDto)

      return '예산 수정에 성공했습니다.'
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('예산 수정에 실패했습니다.')
    }
  }

  async recommendBudget(budgetDto: BudgetDto.Recommend) {
    try {
      const budgetRatio = await this.budgetRepository.getBudgetRatio()
      console.log(budgetRatio)

      // 사용자가 입력한 총 예산
      const totalBudget = Number(budgetDto.total)

      // 총액을 비율에 따라 나누어 각 카테고리의 예산을 계산
      const calculateBudget = (ratio: number) => {
        return Math.round((totalBudget * ratio) / 100) * 100
      }

      let others = 0 // 10% 이하의 카테고리
      const recommendedBudget = Object.keys(budgetRatio).reduce(
        (result, key) => {
          if (budgetRatio[key] <= 0.1) {
            others += budgetRatio[key]
          } else {
            result[key] = calculateBudget(budgetRatio[key])
          }
          return result
        },
        {},
      )

      // 10% 이하의 카테고리를 '기타'로 묶어서 추가
      recommendedBudget['기타'] = calculateBudget(others)

      return recommendedBudget
    } catch (error) {
      throw new InternalServerErrorException('예산 추천에 실패했습니다.')
    }
  }
}
