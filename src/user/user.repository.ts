import { Repository } from 'typeorm'
import { CustomRepository } from 'src/common/decorator/typeorm-ex.decorator'
import { User } from './entities/user.entity'
import { AuthDTO } from 'src/auth/dto/authDto'

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(user: AuthDTO.SignUp): Promise<void> {
    await this.save(user)
  }

  async findByField(fieldName: string, value: any): Promise<User> {
    const query = {}
    query[fieldName] = value

    const user = await this.findOne({ where: query })
    return user
  }
}
