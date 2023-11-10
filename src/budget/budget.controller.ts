import {
  Controller,
  Post,
  Put,
  Body,
  UseGuards,
  Param,
  UnauthorizedException,
} from '@nestjs/common'
import { BudgetService } from './budget.service'
import { BudgetDto } from './dto/budgetDto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/auth/get-user.decorator'

@UseGuards(AuthGuard())
@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async createBudget(
    @Body() budgetDto: BudgetDto.Create,
    @GetUser() userId: string,
  ): Promise<string> {
    if (!userId) {
      throw new UnauthorizedException('사용자 인증이 필요합니다.')
    }

    return this.budgetService.createBudget(budgetDto, userId)
  }

  @Put(':id')
  async updateBudget(
    @Body() budgetDto: BudgetDto.Update,
    @Param('id') budgetId: number,
  ) {
    await this.budgetService.updateBudget(budgetId, budgetDto)
  }
}
