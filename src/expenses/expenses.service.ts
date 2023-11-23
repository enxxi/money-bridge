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
    // 오늘의 지출을 추천하는 함수
    try {
      const today = new Date()
      let totalAmount = 0
      let categoryBudgets = []
      const minBudget = 1000 // 최소 예산
      const totalDays = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
      ).getDate()
      const remainingDays = totalDays - today.getDate() + 1

      for (let i of [1, 2, 3, 4, 5, 6, 7, 8]) {
        const categoryId = i
        // 이번 기간 카테고리 예산
        const budget = await this.budgetRepository.findBudgetByDate(
          userId,
          categoryId,
          today,
        )

        // 이번 달 카테고리 지출 금액
        const amount = await this.expensesRepository.getExpensesSpent(budget.id)

        // 총 지출 금액
        totalAmount += amount

        // 남은 예산 계산
        let remainingBudget = budget.budget - amount
        remainingBudget = remainingBudget < 0 ? 0 : remainingBudget

        // 일별 예산 계산
        let dailyBudget =
          Math.round(remainingBudget / remainingDays / 100) * 100

        //최소 예산 설정
        dailyBudget = dailyBudget < minBudget ? minBudget : dailyBudget

        categoryBudgets.push({
          categoryId: categoryId,
          dailyBudget: dailyBudget,
        })
      }

      const totalDailyBudget = categoryBudgets.reduce(
        (acc, cur) => acc + cur.dailyBudget,
        0,
      )

      let message = '절약을 잘 실천하고 계세요! 오늘도 절약 도전!'
      if (totalDailyBudget < minBudget * 8) {
        message = '예산이 어렵습니다. 가능한 한 절약해보세요!'
      } else if (totalDailyBudget < minBudget * 8 * 0.7) {
        message = '적당히 사용 중입니다. 계속 좋은 소비 습관을 유지해보세요!'
      } else if (totalDailyBudget > minBudget * 8) {
        message =
          '잘 아끼고 있습니다. 이대로 유지하면 좋은 소비 습관이 될 것입니다!'
      }
      return { totalDailyBudget, categoryBudgets, message }
    } catch (error) {
      this.handleError(error, '오늘 지출 추천에 실패했습니다.')
    }
  }

  async todayExpenses(userId) {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const totalDays = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
      ).getDate()

      let totalSpent = 0
      let categoryExpenses = []

      for (let i of [1, 2, 3, 4, 5, 6, 7, 8]) {
        const categoryId = i

        // 이번 기간 카테고리 예산
        const budget = await this.budgetRepository.findBudgetByDate(
          userId,
          categoryId,
          today,
        )

        // 오늘 카테고리 지출 금액
        const amountSpent = Number(
          await this.expensesRepository.findByDate(
            userId,
            categoryId,
            today,
            tomorrow,
          ),
        )

        // 총 지출 금액
        totalSpent += amountSpent

        // 일별 적정 예산 계산
        const appropriateAmount =
          Math.round(budget.budget / totalDays / 100) * 100

        // 위험도 계산
        const dangerRate = (amountSpent / appropriateAmount) * 100

        categoryExpenses.push({
          categoryId: categoryId,
          appropriateAmount: appropriateAmount,
          amountSpent: amountSpent,
          dangerRate: dangerRate,
        })
      }
      return {
        totalSpent,
        categoryExpenses,
      }
    } catch (error) {
      this.handleError(error, '오늘 지출 추천에 실패했습니다.')
    }
  }

  private handleError(error: any, message: string) {
    console.log(error)
    throw new InternalServerErrorException(message)
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
