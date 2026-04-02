import { IBaseService } from '@/modules/core/interfaces/base-service.interface';
import { User } from '../models/entity/user.entity';
import { CreateUserDto } from '../models/dto/create-user.dto';

export interface IUserService extends IBaseService<
  User,
  CreateUserDto,
  unknown,
  Omit<User, 'password'>
> {
  create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>>;
  findOne(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
