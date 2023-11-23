import {
  Controller,
  Post,
  Body,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Param,
  Put,
  Get,
  Delete,
} from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { ExpensesDto } from './dto/expensesDto'
import { GetUser } from 'src/auth/get-user.decorator'
import { AuthGuard } from '@nestjs/passport'
import { StatisticsService } from './statistics.service'

@UseGuards(AuthGuard())
@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly statisticsService: StatisticsService,
  ) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createExpenses(
    @Body() expensesDto: ExpensesDto.Create,
    @GetUser() userId: string,
  ) {
    return await this.expensesService.createExpenses(expensesDto, userId)
  }

  @UsePipes(ValidationPipe)
  @Put(':id')
  async updateExpenses(
    @Param('id') expensesId: number,
    @Body()
    expensesDto: ExpensesDto.Update,
    @GetUser() userId: string,
  ) {
    return await this.expensesService.updateExpenses(
      expensesDto,
      userId,
      expensesId,
    )
  }

  @Get()
  async getExpensesList(
    @Query()
    expensesDto: ExpensesDto.GetList,
    @GetUser() userId: string,
  ) {
    return await this.expensesService.getExpensesList(expensesDto, userId)
  }
  @Get('recommend')
  async recommendExpenses(@GetUser() userId: string) {
    return await this.expensesService.recommendDailyExpenses(userId)
  }

  @Get('today')
  async todayExpenses(@GetUser() userId: string) {
    return await this.expensesService.todayExpenses(userId)
  }

  @Get('statistics/monthly')
  async getRatioComparedToLastMonth(@GetUser() userId: string) {
    return await this.statisticsService.getRatioComparedToLastMonth(userId)
  }

  @Get('statistics/daily')
  async getRatioComparedToLastWeek(@GetUser() userId: string) {
    return await this.statisticsService.getRatioComparedToLastWeek(userId)
  }

  @Get(':id')
  async getExpensesDetail(
    @Param('id') expensesId: number,
    @GetUser() userId: string,
  ) {
    return await this.expensesService.getExpensesDetail(expensesId, userId)
  }

  @Delete(':id')
  async deleteExpenses(
    @Param('id') expensesId: number,
    @GetUser() userId: string,
  ) {
    return await this.expensesService.deleteExpenses(expensesId, userId)
  }
}
