import { IUserService } from './user.service.interface';

export const createUserServiceMock = (): jest.Mocked<IUserService> => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
});
