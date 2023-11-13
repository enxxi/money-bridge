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

      const budget = await this.budgetRepository.findBudgetByDate(
        userId,
        categoryId,
        date,
      )
      if (!budget)
        throw new NotFoundException('해당 기간의 예산을 찾을 수 없습니다.')

      await this.expensesRepository.createExpenses(
        expensesDto,
        userId,
        budget.id,
      )
      return '지출 등록을 성공하였습니다.'
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleError(error, '지출 등록을 실패하였습니다.')
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
      const expenses = await this.getExpenses(expensesId)

      // 현재 로그인 한 사용자가 지출 내역 작성자가 맞는지 검증합니다.
      this.checkAccess(userId, expenses, '수정')
      await this.expensesRepository.updateExpenses(expensesDto, expensesId)
      return '지출 수정에 성공하였습니다.'
    } catch (error) {
      if (error instanceof NotFoundException || ForbiddenException) {
        throw error
      }
      this.handleError(error, '지출 수정에 실패하였습니다.')
    }
  }

  async getExpensesList(expensesDto: ExpensesDto.GetList, userId: string) {
    // 지출 내역을 반환하는 함수
    try {
      // startDate, endDate가 없을 경우 기본값 설정
      if (!expensesDto.startDate || !expensesDto.endDate) {
        const today = new Date()
        const twoWeeksAgo = new Date()
        twoWeeksAgo.setDate(today.getDate() - 14)
        expensesDto.startDate = twoWeeksAgo.toISOString()
        expensesDto.endDate = today.toISOString()
      }

      const expenses = await this.expensesRepository.getExpensesList(
        userId,
        expensesDto,
      )

      // (합계제외 지출을 제외한) 전체 지출 총액과 카테고리별 지출 총액
      const { totalAmount, categoryTotals } = expenses.reduce(
        (acc, expense) => {
          acc.totalAmount += expense.isExcluded ? 0 : expense.expenses
          acc.categoryTotals[expense.category.id] =
            (acc.categoryTotals[expense.category.id] || 0) +
            (expense.isExcluded ? 0 : expense.expenses)
          return acc
        },
        { totalAmount: 0, categoryTotals: {} },
      )

      return {
        message: '지출 내역 목록 반환에 성공했습니다.',
        expenses,
        totalAmount,
        categoryTotals,
      }
    } catch (error) {
      this.handleError(error, '지출 내역 목록 반환에 실패했습니다.')
    }
  }

  async getExpensesDetail(expensesId: number, userId: string) {
    // 지출 상세 정보를 반환하는 함수
    try {
      const expenses = await this.getExpenses(expensesId)

      // 현재 로그인 한 사용자가 지출 내역 작성자가 맞는지 검증합니다.
      this.checkAccess(userId, expenses, '조회')
      return { message: '지출 내역 상세 조회에 성공했습니다.', expenses }
    } catch (error) {
      if (error instanceof NotFoundException || ForbiddenException) throw error
      this.handleError(error, '지출 내역 상세 조회에 실패했습니다.')
    }
  }

  async deleteExpenses(expensesId: number, userId: string) {
    try {
      const expenses = await this.getExpenses(expensesId)

      // 현재 로그인 한 사용자가 지출 내역 작성자가 맞는지 검증합니다.
      this.checkAccess(userId, expenses, '삭제')
      await this.expensesRepository.deleteExpenses(expensesId)
      return '지출 내역 삭제에 성공했습니다.'
    } catch (error) {
      if (error instanceof NotFoundException || ForbiddenException) throw error
      this.handleError(error, '지출 내역 삭제에 실패했습니다.')
    }
  }

  async recommendDailyExpenses(userId) {
    try {
      const today = new Date()
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
      )
      console.log(firstDayOfMonth, lastDayOfMonth)
      for (let i of [1, 2, 3, 4, 5, 6, 7, 8]) {
        const categoryId = i
        // 이번 달 카테고리 예산
        const budget = await this.getBudget(userId, categoryId, today)
        // 이번 달 카테고리 지출 금액

        // const spentThisMonth = await this.getExpensesByCategory(
        //   userId,
        //   categoryId,
        //   // 오늘이 포함된 달
        // )
        console.log(budget)
      }
    } catch (error) {
      this.handleError(error, '오늘 지출 추천에 실패했습니다.')
    }
  }
  async todayExpenses() {
    try {
    } catch (error) {
      this.handleError(error, '오늘 지출 추천에 실패했습니다.')
    }
  }

  private handleError(error: any, message: string) {
    console.log(error)
    throw new InternalServerErrorException(message)
  }

  private async getBudget(userId: string, categoryId: number, date: Date) {
    // 조건에 맞는 예산을 가져옵니다.
    return await this.budgetRepository.findBudgetByDate(
      userId,
      categoryId,
      date,
    )
  }

  private async getExpenses(expensesId) {
    const expenses = await this.expensesRepository.findById(expensesId)
    if (!expenses) {
      throw new NotFoundException('해당 id의 지출 내역을 찾을 수 없습니다.')
    }
    return expenses
  }

  private checkAccess(userId, expenses, action) {
    if (expenses.user.id !== userId) {
      throw new ForbiddenException(`${action} 권한이 없습니다.`)
    }
  }
}
