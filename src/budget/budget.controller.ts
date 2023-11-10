import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common'
import { BudgetService } from './budget.service'
import { BudgetDto } from './dto/budgetDto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/auth/get-user.decorator'
import { User } from 'src/user/entities/user.entity'

@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @UseGuards(AuthGuard())
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
}
