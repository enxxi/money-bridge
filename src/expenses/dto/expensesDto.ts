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
import { ApiProperty } from '@nestjs/swagger'

export namespace ExpensesDto {
  export class Create {
    @ApiProperty({
      example: '50000',
      description: '지출액',
      required: true,
    })
    @IsNotEmpty({ message: '지출 금액은 필수적으로 입력해야 합니다.' })
    @IsNumber()
    expenses: number

    @ApiProperty({
      example: '2024-09-11',
      description: '지출 일자',
      required: true,
    })
    @IsNotEmpty({ message: '지출 일자는 필수적으로 입력해야 합니다.' })
    @IsDateString()
    date: Date

    @ApiProperty({
      example: '점심',
      description: '지출 내용',
      required: false,
    })
    @IsString()
    description?: string

    @ApiProperty({
      example: 'true',
      description: '합산 제외',
      required: false,
    })
    @IsBoolean()
    isExcluded?: boolean

    @ApiProperty({
      example: '1',
      description: '지출 카테고리 id',
      required: true,
    })
    @IsNotEmpty({ message: '카테고리의 id는 필수적으로 입력해야 합니다.' })
    @IsIn([1, 2, 3, 4, 5, 6, 7, 8], { message: '카테고리 id는 1~8입니다.' })
    @IsNumber()
    categoryId: number
  }

  export class Update {
    @ApiProperty({
      example: '50000',
      description: '지출액',
      required: false,
    })
    @IsOptional()
    @IsNumber()
    expenses?: number

    @ApiProperty({
      example: '2024-09-11',
      description: '지출 일자',
      required: false,
    })
    @IsOptional()
    @IsDateString()
    date?: Date

    @ApiProperty({
      example: '점심',
      description: '지출 내용',
      required: false,
    })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({
      example: 'true',
      description: '합산 제외',
      required: false,
    })
    @IsOptional()
    @IsBoolean()
    isExcluded?: boolean

    @ApiProperty({
      example: '1',
      description: '지출 카테고리 id',
      required: false,
    })
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
