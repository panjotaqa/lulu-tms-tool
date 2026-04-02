import { User } from '../models/entity/user.entity';
import { IUserRepository } from './user.repository.interface';
import { createBaseRepository } from '@/modules/core/database/base.repository.mock';

export const createRepositoryMock = (): jest.Mocked<IUserRepository> => ({
  ...createBaseRepository<User>(),
  findOneWithoutPass: jest.fn(),
});
