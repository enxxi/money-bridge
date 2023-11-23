import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtStrategy } from './jwt.strategy'
import { JwtRefreshTokenStrategy } from './jwt-refresh.strategy'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmExModule } from 'src/common/decorator/typeorm-ex.module'
import { UserRepository } from 'src/user/user.repository'
import { Refresh } from 'src/user/entities/refresh.entity'

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Refresh]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
