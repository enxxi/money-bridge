import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  Length,
} from 'class-validator'

export namespace AuthDTO {
  export class SignUp {
    @IsString()
    @MinLength(2, { message: '닉네임은 최소 2글자 이상 입력해야 합니다.' })
    @MaxLength(10, { message: '닉네임은 10글자까지 입력 가능합니다.' })
    username: string

    @IsString()
    @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, {
      message: '비밀번호는 숫자, 영어, 특수문자를 사용하여 작성해야합니다.',
    })
    @MinLength(8, { message: '비밀번호는 최소 8자리 이상 입력해야 합니다.' })
    @MaxLength(20, { message: '비밀번호는 20자까지 설정 가능합니다.' })
    password: string

    @IsEmail()
    email: string
  }

  export class SignIn {
    @IsEmail()
    email: string

    @IsString()
    @Length(4, 20)
    password: string
  }
}
