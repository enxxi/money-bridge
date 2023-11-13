import { CustomRepository } from 'src/common/decorator/typeorm-ex.decorator'
import { Expenses } from './entities/expenses.entity'
import { Repository } from 'typeorm'
import { ExpensesDto } from './dto/expensesDto'

@CustomRepository(Expenses)
export class ExpensesRepository extends Repository<Expenses> {
  async createExpenses(
    expensesDto: ExpensesDto.Create,
    userId: string,
    budgetId: number,
  ) {
    const { categoryId } = expensesDto
    const newExpenses = this.create({
      user: { id: userId },
      category: { id: categoryId },
      budget: { id: budgetId },
      ...expensesDto,
    })
    await this.save(newExpenses)
  }

  async updateExpenses(expensesDto: ExpensesDto.Update, expensesId: number) {
    const { categoryId, ...rest } = expensesDto
    await this.createQueryBuilder()
      .update(Expenses)
      .set({ ...rest, category: { id: categoryId } })
      .where('id = :id', { id: expensesId })
      .execute()
  }

  async findById(expensesId: number): Promise<Expenses> {
    return await this.createQueryBuilder('expenses')
      .where('expenses.id = :id', { id: expensesId })
      .leftJoin('expenses.user', 'user')
      .addSelect('user.id')
      .getOne()
  }

  async getExpensesList(userId, expensesDto) {
    const { startDate, endDate, categoryId, minAmount, maxAmount } = expensesDto

    // 쿼리빌더에 userId와 기간을 설정 (필수 조건)
    let query = this.createQueryBuilder('expenses')
      .select([
        'expenses.id',
        'expenses.expenses',
        'expenses.date',
        'expenses.createdAt',
        'expenses.isExcluded',
      ])
      .leftJoinAndSelect('expenses.category', 'category')
      .where('expenses.user_id = :userId', { userId })
      .andWhere('expenses.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })

    // 검색 조건 쿼리에 categoryId, minAmount, maxAmount가 있다면 검색
    if (categoryId) {
      query = query.andWhere('expenses.category_id = :categoryId', {
        categoryId,
      })
    }
    if (minAmount) {
      query = query.andWhere('expenses.expenses > :minAmount', { minAmount })
    }
    if (maxAmount) {
      query = query.andWhere('expenses.expenses < :maxAmount', { maxAmount })
    }

    return await query.getMany()
  }

  async deleteExpenses(expensesId: number) {
    await this.delete(expensesId)
  }
}
