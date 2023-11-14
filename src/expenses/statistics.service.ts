import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ExpensesRepository } from './expenses.repository'

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(ExpensesRepository)
    private expensesRepository: ExpensesRepository,
  ) {}

  async getRatioComparedToLastMonth(userId) {
    const today = new Date()
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)

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

    // 지난 달과 이번 달의 카테고리별 지출액을 계산
    const lastMonthExpensesByCategory =
      await this.expensesRepository.getSumByCategory(
        userId,
        lastMonthStartDate,
        lastMonthEndDate,
      )
    const thisMonthExpensesByCategory =
      await this.expensesRepository.getSumByCategory(
        userId,
        thisMonthStartDate,
        today,
      )

    // 지난 달과 이번 달의 총 지출액을 계산
    const lastMonthTotalExpenses = await this.expensesRepository.findByDate(
      userId,
      null,
      lastMonthStartDate,
      lastMonthEndDate,
    )
    const thisMonthTotalExpenses = await this.expensesRepository.findByDate(
      userId,
      null,
      thisMonthStartDate,
      today,
    )

    // 총 지출액에 대한 증감률 계산
    const totalRate = (thisMonthTotalExpenses / lastMonthTotalExpenses) * 100

    // 각 카테고리별 지출 증감률 계산
    const ratioComparedToLastMonth = thisMonthExpensesByCategory.map(
      (thisMonthExpenses) => {
        const lastMonthExpenses = lastMonthExpensesByCategory.find(
          (expense) => expense.categoryId === thisMonthExpenses.categoryId,
        ) || { amount: 0 }
        let rate
        // 지난 달에 해당 카테고리에 지출이 없었다면, 이번 달에 지출이 있으면 100% / 없으면 0%로 증감률 설정
        if (lastMonthExpenses.amount === 0) {
          rate = thisMonthExpenses.amount > 0 ? 100 : 0
        } else {
          rate = (thisMonthExpenses.amount / lastMonthExpenses.amount) * 100
        }
        return { ...thisMonthExpenses, rate }
      },
    )

    // 총 지출 증감률과 카테고리별 지출 증감률 반환
    return {
      totalRate: { lastMonthTotalExpenses, thisMonthTotalExpenses, totalRate },
      ratioComparedToLastMonth,
    }
  }
  async getRatioComparedToLastWeek() {}
  async getRatioComparedToOtherUser() {}
}
