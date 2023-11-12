import {
  Controller,
  Post,
  Body,
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

@UseGuards(AuthGuard())
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createExpenses(
    @Body() expensesDto: ExpensesDto.Create,
    @GetUser() userId: string,
  ) {
    console.log(expensesDto)
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
}
