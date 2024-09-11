import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidationOptions,
  IsDateString,
  registerDecorator,
} from 'class-validator'

export namespace BudgetDto {
  export class Create {
    @ApiProperty({
      example: '2024-09-01',
      description: '시작 일자',
      required: true,
    })
    @IsNotEmpty({ message: '시작 일자는 필수적으로 입력해야 합니다.' })
    @IsDateString()
    startDate: Date

    @ApiProperty({
      example: '2024-09-31',
      description: '종료 일자',
      required: true,
    })
    @IsNotEmpty({ message: '종료 일자는 필수적으로 입력해야 합니다.' })
    @IsDateString()
    endDate: Date

    @ApiProperty({
      example: {
        1: 10000,
        2: 20000,
        3: 30000,
        4: 40000,
        5: 50000,
        6: 60000,
        7: 70000,
        8: 80000,
        9: 90000,
      },
      description: '카테고리별 예산',
      required: true,
    })
    @IsNotEmpty({ message: '각 카테고리별 예산은 필수적으로 입력해야 합니다.' })
    @IsCategoryId({ message: '카테고리 id는 1~9로 설정해주세요.' })
    @IsObject()
    categoryBudgets: Record<number, number> // <카테고리 id, 예산>
  }

  export class Update {
    @ApiProperty({
      example: '2024-09-01',
      description: '시작 일자',
      required: false,
    })
    @IsDateString()
    startDate?: Date

    @ApiProperty({
      example: '2024-09-31',
      description: '종료 일자',
      required: false,
    })
    @IsDateString()
    endDate?: Date

    @ApiProperty({
      example: '10',
      description: '예산 값',
      required: false,
    })
    @IsNumber()
    budget?: number
  }

  export class Recommend {
    @ApiProperty({
      example: '300000',
      description: '자산 총액',
      required: true,
    })
    @IsNotEmpty({ message: '총액은 필수적으로 입력해야 합니다.' })
    @IsNumber()
    total: number
  }

  export function IsCategoryId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isCategoryId',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [],
        options: validationOptions,
        validator: {
          validate(value: any, ValidationArguments) {
            // 모든 키가 1~9 사이인지 확인합니다.
            return Object.keys(value).every(
              (key) => 1 <= Number(key) && Number(key) <= 9,
            )
          },
        },
      })
    }
  }
}
