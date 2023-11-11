import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { User } from 'src/user/entities/user.entity'

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest()

    if (!req.user) {
      throw new UnauthorizedException('사용자 인증이 필요합니다.')
    }

    return req.user
  },
)
