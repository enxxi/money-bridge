import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDTO } from './dto/authDto'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() authDTO: AuthDTO.SignIn): Promise<object> {
    return this.authService.signIn(authDTO)
  }

  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Get('/refresh')
  async getRefreshToken(@Request() req): Promise<{ accessToken: string }> {
    return this.authService.getNewAccessToken(req.user)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id)
  // }

  // // @Patch(':id')
  // // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  // //   return this.authService.update(+id, updateAuthDto)
  // // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id)
  // }
}
