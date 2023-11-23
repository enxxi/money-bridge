import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsString,
  IsBoolean,
  IsIn,
  IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'

export namespace ExpensesDto {
  export class Create {
    @IsNotEmpty({ message: '지출 금액은 필수적으로 입력해야 합니다.' })
    @IsNumber()
    expenses: number

    @IsNotEmpty({ message: '지출 일자는 필수적으로 입력해야 합니다.' })
    @IsDateString()
    date: Date

    @IsString()
    description?: string

    @IsBoolean()
    isExcluded?: boolean

    @IsNotEmpty({ message: '카테고리의 id는 필수적으로 입력해야 합니다.' })
    @IsIn([1, 2, 3, 4, 5, 6, 7, 8], { message: '카테고리 id는 1~8입니다.' })
    @IsNumber()
    categoryId: number
  }

  export class Update {
    @IsOptional()
    @IsNumber()
    expenses?: number

    @IsOptional()
    @IsDateString()
    date?: Date

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsBoolean()
    isExcluded?: boolean

    @IsOptional()
    @IsIn([1, 2, 3, 4, 5, 6, 7, 8], { message: '카테고리 id는 1~8입니다.' })
    @IsNumber()
    categoryId?: number
  }

  export class GetList {
    @IsString()
    startDate: string

    @IsString()
    endDate: string

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    categoryId?: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minAmount?: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxAmount?: number
  }
}
