import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthDTO } from 'src/auth/dto/authDto'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(authDTO: AuthDTO.SignUp) {
    try {
      const { email, username, password } = authDTO

      const existingEmail = await this.userRepository.findByField(
        'email',
        email,
      )
      if (existingEmail) {
        throw new ConflictException('이미 존재하는 이메일입니다.')
      }

      const existingUsername = await this.userRepository.findByField(
        'username',
        username,
      )
      if (existingUsername) {
        throw new ConflictException('이미 존재하는 닉네임입니다.')
      }

      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(password, salt)
      const user = { ...authDTO, password: hashedPassword }

      await this.userRepository.signUp(user)

      return '회원가입에 성공했습니다.'
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new InternalServerErrorException('회원가입에 실패했습니다.')
    }
  }
}
