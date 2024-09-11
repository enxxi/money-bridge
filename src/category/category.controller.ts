import { Controller, Get, UseGuards } from '@nestjs/common'
import { CategoryService } from './category.service'
import { Category } from './entities/category.entity'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth } from '@nestjs/swagger'

@ApiBearerAuth('access-token')
@Controller('budgets/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard())
  @Get()
  async getCategoryList(): Promise<Category[]> {
    return await this.categoryService.getCategoryList()
  }
}
