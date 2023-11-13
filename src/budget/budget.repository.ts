import { Repository } from 'typeorm'
import { CustomRepository } from 'src/common/decorator/typeorm-ex.decorator'
import { Budget } from './entities/budget.entity'
import { BudgetDto } from './dto/budgetDto'

@CustomRepository(Budget)
export class BudgetRepository extends Repository<Budget> {
  async createBudget(
    // 예산을 설정하는 함수. user와 category의 id를 가지고 관계를 설정함.
    userId: string,
    startDate: Date,
    endDate: Date,
    categoryId: number,
    budget: number,
  ): Promise<void> {
    const newBudget = this.create({
      user: { id: userId },
      category: { id: categoryId },
      startDate,
      endDate,
      budget,
    })
    await this.save(newBudget)
  }

  async updateBudget(budgetId: number, budgetDto: BudgetDto.Update) {
    // 예산을 수정하는 함수
    return await this.update(budgetId, budgetDto)
  }

  async findById(budgetId: number): Promise<Budget> {
    return await this.findOne({ where: { id: budgetId } })
  }

  async getBudgetRatio() {
    // 각 카테고리의 총 예산 대비 비율을 계산하는 함수

    const categories = await this.createQueryBuilder('budget')
      .select('budget.category_id', 'categoryId')
      .addSelect('SUM(budget.budget)', 'totalBudget')
      .groupBy('budget.category_id')
      .getRawMany()

    // 총 예산을 계산
    const totalBudget = categories.reduce(
      (sum, category) => sum + Number(category.totalBudget),
      0,
    )

    // 각 카테고리의 예산 비율을 계산
    const budgetRatio = categories.reduce((result, category) => {
      result[category.categoryId] = parseFloat(
        (Number(category.totalBudget) / totalBudget).toFixed(2),
      )
      return result
    }, {})

    return budgetRatio
  }

  async findBudgetByDate(userId: string, categoryId: number, date: Date) {
    // 해당 사용자의 지출 일자가 포함된 예산을 찾는 함수
    const budget = await this.createQueryBuilder('budget')
      .where('budget.user_id = :userId', { userId })
      .andWhere('budget.category_id = :categoryId', { categoryId })
      .andWhere('budget.startDate <= :date', { date })
      .andWhere('budget.endDate >= :date', { date })
      .getOne()
    console.log(userId, budget)
    return budget
  }
}
