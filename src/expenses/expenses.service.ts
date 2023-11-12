import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ExpensesRepository } from './expenses.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { ExpensesDto } from './dto/expensesDto'
import { BudgetRepository } from 'src/budget/budget.repository'

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpensesRepository)
    private expensesRepository: ExpensesRepository,
    @InjectRepository(BudgetRepository)
    private budgetRepository: BudgetRepository,
  ) {}

  async createExpenses(expensesDto: ExpensesDto.Create, userId: string) {
    // 지출을 등록하는 함수
    try {
      const { categoryId, date } = expensesDto

      // 지출 일자에서 연도와 월 추출
      const dateObj = new Date(date)
      const year = dateObj.getFullYear()
      const month = dateObj.getMonth() + 1

      // 조건에 맞는 예산을 가져옵니다.
      const budget = await this.budgetRepository.findByUserAndCategory(
        userId,
        categoryId,
        year,
        month,
      )

      if (!budget)
        throw new NotFoundException('이번 달 예산을 찾을 수 없습니다.')

      await this.expensesRepository.createExpenses(
        expensesDto,
        userId,
        budget.id,
      )

      return '지출 등록을 성공하였습니다.'
    } catch (error) {
      console.log(error)
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException('지출 등록을 실패하였습니다.')
    }
  }

  async updateExpenses(
    expensesDto: ExpensesDto.Update,
    userId: string,
    expensesId: number,
  ) {
    // 지출을 수정하는 함수
    try {
      // params로 받은 id로 지출 내역을 찾습니다.
      const expenses = await this.expensesRepository.findById(expensesId)

      if (!expenses) {
        throw new NotFoundException('해당 id의 지출 내역을 찾을 수 없습니다.')
      }

      // 현재 로그인 한 사용자가 지출 내역 작성자가 맞는지 검증합니다.
      if (expenses.user.id !== userId) {
        throw new ForbiddenException('수정 권한이 없습니다.')
      }

      await this.expensesRepository.updateExpenses(expensesDto, expensesId)
      return '지출 수정에 성공하였습니다.'
    } catch (error) {
      console.log(error)
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error
      }
      throw new InternalServerErrorException('지출 수정에 실패하였습니다.')
    }
  }
}
