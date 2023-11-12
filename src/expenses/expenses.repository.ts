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
    return await this.findOne({
      where: { id: expensesId },
      relations: ['user'],
    })
  }
}
