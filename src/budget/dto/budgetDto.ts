import {
  IsNotEmpty,
  IsNumber,
  IsIn,
  IsObject,
  ValidationOptions,
  IsDateString,
  registerDecorator,
} from 'class-validator'

export namespace BudgetDto {
  export class Create {
    @IsNotEmpty({ message: '시작 일자는 필수적으로 입력해야 합니다.' })
    @IsDateString()
    startDate: Date

    @IsNotEmpty({ message: '종료 일자는 필수적으로 입력해야 합니다.' })
    @IsDateString()
    endDate: Date

    @IsNotEmpty({ message: '각 카테고리별 예산은 필수적으로 입력해야 합니다.' })
    @IsCategoryId({ message: '카테고리 id는 1~9로 설정해주세요.' })
    @IsObject()
    categoryBudgets: Record<number, number> // <카테고리 id, 예산>
  }

  export class Update {
    @IsDateString()
    startDate?: Date

    @IsDateString()
    endDate?: Date

    @IsNumber()
    budget?: number
  }

  export class Recommend {
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
              (key) => 1 <= Number(key) && Number(key) <= 8,
            )
          },
        },
      })
    }
  }
}
