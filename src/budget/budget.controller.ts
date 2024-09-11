import {
  Controller,
  Post,
  Put,
  Body,
  UseGuards,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { BudgetService } from './budget.service'
import { BudgetDto } from './dto/budgetDto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/auth/get-user.decorator'
import { ApiBearerAuth } from '@nestjs/swagger'

@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createBudget(
    @Body() budgetDto: BudgetDto.Create,
    @GetUser() userId: string,
  ): Promise<string> {
    return await this.budgetService.createBudget(budgetDto, userId)
  }

  @Post('/recommend')
  async recommendBudget(@Body() budgetDto: BudgetDto.Recommend) {
    return await this.budgetService.recommendBudget(budgetDto)
  }

  @Put(':id')
  async updateBudget(
    @Body() budgetDto: BudgetDto.Update,
    @Param('id') budgetId: number,
  ): Promise<string> {
    return await this.budgetService.updateBudget(budgetId, budgetDto)
  }

  // @Get()
  // async getBudgetList():Promise<array>{return await this.budgetService.

  // }
}
