import { IBaseRepository } from '@/modules/core/database/interfaces/base-repository.interface';
import { User } from '../models/entity/user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  findOneWithoutPass(id: string): Promise<User | null>;
}
