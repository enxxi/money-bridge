import { Repository } from 'typeorm'
import { CustomRepository } from 'src/common/decorator/typeorm-ex.decorator'
import { Budget } from './entities/budget.entity'
import { BudgetDto } from './dto/budgetDto'

@CustomRepository(Budget)
export class BudgetRepository extends Repository<Budget> {
  async createBudget(userId: string, budget: BudgetDto.Create): Promise<void> {
    const { categoryId } = budget
    const newBudget = this.create({
      user: { id: userId },
      category: { id: categoryId },
      ...budget,
    })
    await this.save(newBudget)
  }
}
