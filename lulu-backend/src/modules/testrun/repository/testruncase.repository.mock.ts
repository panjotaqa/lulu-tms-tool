import { ITestRunCaseRepository } from './testruncase.repository.interface';

export const createTestRunCaseRepositoryMock =
  (): jest.Mocked<ITestRunCaseRepository> =>
    ({
      updateStatus: jest.fn(),
      updateEvidence: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }) as unknown as jest.Mocked<ITestRunCaseRepository>;
