import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/database/base.repository';
import { User } from '../models/entity/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {
    super(_userRepository);
  }

  public async findOneWithoutPass(id: string): Promise<User | null> {
    const user = await this._userRepository.findOne({
      where: { id },
      select: { password: false },
    });
    if (!user) {
      return null;
    }
    return user;
  }
}
