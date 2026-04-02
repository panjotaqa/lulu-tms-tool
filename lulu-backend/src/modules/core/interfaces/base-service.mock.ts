import { IBaseService } from './base-service.interface';

export const createBaseServiceMock = <T>(): jest.Mocked<IBaseService<T>> => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});
