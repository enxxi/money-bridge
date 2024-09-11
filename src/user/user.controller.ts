import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthDTO } from 'src/auth/dto/authDto'
import { ApiBearerAuth } from '@nestjs/swagger'

@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() authDTO: AuthDTO.SignUp): Promise<string> {
    try {
      return this.userService.signUp(authDTO)
    } catch (error) {
      console.log(error)
    }
  }
}
