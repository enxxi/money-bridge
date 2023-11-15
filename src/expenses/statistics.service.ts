import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ExpensesRepository } from './expenses.repository'

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(ExpensesRepository)
    private expensesRepository: ExpensesRepository,
  ) {}

  async getRatioComparedToLastMonth(userId) {
    try {
      // 저번 달 지출과 비교하는 함수
      const today = new Date()
      const lastMonth = new Date(today)
      lastMonth.setMonth(today.getMonth() - 1)

      const [lastMonthStartDate, lastMonthEndDate, thisMonthStartDate] =
        this.calculateStartAndEndDate(today, lastMonth)

      // 지난 달과 이번 달의 카테고리별 지출액, 총 지출액을 계산
      let [
        lastMonthExpensesByCategory,
        thisMonthExpensesByCategory,
        lastMonthTotalExpenses,
        thisMonthTotalExpenses,
      ] = await Promise.all([
        this.expensesRepository.getSumByCategory(
          userId,
          lastMonthStartDate,
          lastMonthEndDate,
        ),
        this.expensesRepository.getSumByCategory(
          userId,
          thisMonthStartDate,
          today,
        ),
        this.expensesRepository.findByDate(
          userId,
          null,
          lastMonthStartDate,
          lastMonthEndDate,
        ),
        this.expensesRepository.findByDate(
          userId,
          null,
          thisMonthStartDate,
          today,
        ),
      ])

      if (!lastMonthTotalExpenses || !thisMonthTotalExpenses) {
        throw new NotFoundException('해당 기간의 지출을 찾을 수 없습니다.')
      }

      // 총 지출액에 대한 증감률 계산
      const totalRate = (thisMonthTotalExpenses / lastMonthTotalExpenses) * 100

      // 각 카테고리별 지출 증감률 계산
      const ratioComparedToLastMonth = this.calculateCategoryRates(
        thisMonthExpensesByCategory,
        lastMonthExpensesByCategory,
      )

      // 총 지출 증감률과 카테고리별 지출 증감률 반환
      return {
        message: '지난 달 대비 소비율 반환에 성공하였습니다.',
        totalRate: {
          lastMonthTotalExpenses,
          thisMonthTotalExpenses,
          totalRate,
        },
        ratioComparedToLastMonth,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.log(error)
      throw new InternalServerErrorException(
        '지난 달 대비 소비율 반환에 실패하였습니다.',
      )
    }
  }
  async getRatioComparedToLastWeek(userId) {
    try {
      // 오늘의 요일을 추출하고 같은 요일의 지출 내역을 가져옵니다.
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayDayOfWeek = today.getDay()

      const allSameDayOfWeekExpenses =
        await this.expensesRepository.findByDayOfWeek(
          userId,
          today,
          todayDayOfWeek,
        )

      if (!allSameDayOfWeekExpenses || allSameDayOfWeekExpenses.length === 0) {
        throw new NotFoundException('해당 기간의 지출을 찾을 수 없습니다.')
      }

      // 오늘을 제외한 같은 요일의 지출 평균을 계산합니다.
      const allSameDayOfWeekExpensesAmounts = allSameDayOfWeekExpenses.map(
        (expense) => expense.expenses,
      )
      const averageSameDayOfWeekExpenses =
        allSameDayOfWeekExpensesAmounts.reduce((a, b) => a + b, 0) /
        allSameDayOfWeekExpensesAmounts.length

      // 오늘의 지출 금액을 가져와 같은 요일 평균 대비 소비율을 계산합니다.
      const todayExpenses = await this.expensesRepository.findByDate(
        userId,
        null,
        today,
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      )
      const ratio = (todayExpenses / averageSameDayOfWeekExpenses) * 100

      return { todayDayOfWeek, ratio }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.log(error)
      throw new InternalServerErrorException(
        '같은 요일 대비 소비율 반환에 실패하였습니다.',
      )
    }
  }

  private calculateStartAndEndDate(today, lastMonth) {
    // 오늘 날짜를 기준으로 지난 달과 이번 달의 시작일과 끝일을 계산
    const lastMonthStartDate = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1,
    )
    const lastMonthEndDate = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      today.getDate(),
    )
    const thisMonthStartDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    )
    return [lastMonthStartDate, lastMonthEndDate, thisMonthStartDate]
  }

  private calculateCategoryRates(
    thisMonthExpensesByCategory,
    lastMonthExpensesByCategory,
  ) {
    return thisMonthExpensesByCategory.map((thisMonthExpenses) => {
      const lastMonthExpenses = lastMonthExpensesByCategory.find(
        (expense) => expense.categoryId === thisMonthExpenses.categoryId,
      ) || { amount: 0 }
      let rate =
        lastMonthExpenses.amount === 0
          ? thisMonthExpenses.amount > 0
            ? 100
            : 0
          : (thisMonthExpenses.amount / lastMonthExpenses.amount) * 100
      return { ...thisMonthExpenses, rate }
    })
  }
}
