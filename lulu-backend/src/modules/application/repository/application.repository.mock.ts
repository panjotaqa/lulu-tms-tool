import { IApplicationRepository } from './application.repository.interface';

export const createApplicationRepositoryMock =
  (): jest.Mocked<IApplicationRepository> =>
    ({
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
    }) as unknown as jest.Mocked<IApplicationRepository>;
