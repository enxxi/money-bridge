import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmExModule } from 'src/common/decorator/typeorm-ex.module'
import { UserRepository } from './user.repository'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmExModule],
})
export class UserModule {}
