import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { AuthDTO } from './dto/authDto'
import { UserRepository } from 'src/user/user.repository'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Refresh } from 'src/user/entities/refresh.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(Refresh)
    private refreshRepository: Repository<Refresh>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(authDTO: AuthDTO.SignIn) {
    try {
      const { email, password } = authDTO

      const user = await this.userRepository.findByField('email', email)
      if (!user)
        throw new UnprocessableEntityException('가입 내역이 없는 이메일입니다.')

      const isAuth = await bcrypt.compare(password, user.password)
      if (!isAuth)
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.')

      const payload = { userId: user.id }
      const accessToken = await this.getJwtAccessToken(payload)
      const refreshToken = await this.getJwtRefreshToken(payload)

      const salt = await bcrypt.genSalt()
      const hashedRefreshToken = await bcrypt.hash(refreshToken, salt) // db 유출 문제를 대비해 refresh token을 hash하여 저장

      let rToken = await this.refreshRepository.findOne({
        where: { id: user.id },
      })
      if (rToken) {
        // 이미 존재하는 경우, 토큰 업데이트
        rToken.token = hashedRefreshToken
      } else {
        // 존재하지 않는 경우, 새로운 토큰 생성
        rToken = new Refresh()
        rToken.id = user.id
        rToken.token = hashedRefreshToken
      }

      this.refreshRepository.save(rToken)

      return { accessToken, refreshToken }
    } catch (error) {
      if (
        error instanceof UnprocessableEntityException ||
        error instanceof UnauthorizedException
      ) {
        throw error
      }
      throw new InternalServerErrorException('로그인에 실패하였습니다.')
    }
  }

  // access token 생성
  async getJwtAccessToken(payload: object): Promise<string> {
    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: Number(
        this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      ),
    })
    return token
  }

  // refresh token 생성
  async getJwtRefreshToken(payload: object) {
    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: Number(
        this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      ),
    })

    return token
  }

  // 클라이언트의 refresh token과 해싱된 db의 refresh token 비교
  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
    const userToken = await this.refreshRepository.findOneBy({ id })

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      userToken.token,
    )

    if (isRefreshTokenMatching) return userToken.id
  }

  // 만료된 access token 재발급
  async getNewAccessToken(id: string) {
    const payload = { userId: id }
    const accessToken = await this.getJwtAccessToken(payload)

    return { accessToken }
  }
}
