import { Repository } from 'typeorm'
import { CustomRepository } from 'src/common/decorator/typeorm-ex.decorator'
import { Budget } from './entities/budget.entity'
import { BudgetDto } from './dto/budgetDto'

@CustomRepository(Budget)
export class BudgetRepository extends Repository<Budget> {
  async createBudget(
    // 예산을 설정하는 함수. user와 category의 id를 가지고 관계를 설정함.
    userId: string,
    budgetDto: BudgetDto.Create,
  ): Promise<void> {
    const { categoryId } = budgetDto
    const newBudget = this.create({
      user: { id: userId },
      category: { id: categoryId },
      ...budgetDto,
    })
    await this.save(newBudget)
  }

  async updateBudget(budgetId: number, budgetDto: BudgetDto.Update) {
    // 예산을 수정하는 함수
    const { categoryId, ...newBudget } = budgetDto
    return await this.update(budgetId, {
      category: { id: categoryId },
      ...newBudget,
    })
  }

  async findById(budgetId: number) {
    return await this.findOne({ where: { id: budgetId } })
  }
}
