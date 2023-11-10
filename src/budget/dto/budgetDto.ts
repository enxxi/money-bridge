import { IsNotEmpty, IsNumber, IsIn, IsDateString } from 'class-validator'

export namespace BudgetDto {
  export class Create {
    @IsNotEmpty()
    @IsDateString()
    startDate: Date

    @IsNotEmpty()
    @IsDateString()
    endDate: Date

    @IsNotEmpty()
    @IsNumber()
    budget: number

    @IsNotEmpty()
    @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9], {
      message: '카테고리는 1~9로 설정해 주세요.',
    })
    categoryId: number
  }

  export class Update {
    @IsDateString()
    startDate?: Date

    @IsDateString()
    endDate?: Date

    @IsNumber()
    budget?: number

    @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9], {
      message: '카테고리는 1~9로 설정해 주세요.',
    })
    categoryId?: number
  }
}
