import { IBaseRepository } from './interfaces/base-repository.interface';

export const createBaseRepository = <T>(): jest.Mocked<IBaseRepository<T>> => ({
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  count: jest.fn(),
});
