import { ITestRunRepository } from './testrun.repository.interface';

export const createTestRunRepositoryMock =
  (): jest.Mocked<ITestRunRepository> =>
    ({
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as unknown as jest.Mocked<ITestRunRepository>);
