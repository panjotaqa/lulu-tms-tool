import { ITestCaseRepository } from './testcase.repository.interface';

export const createTestCaseRepositoryMock =
  (): jest.Mocked<ITestCaseRepository> =>
    ({
      findForSelection: jest.fn(),
      findByFolderPaginated: jest.fn(),
      getNextTestCaseSequence: jest.fn(),
      updateFolderIds: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }) as unknown as jest.Mocked<ITestCaseRepository>;
