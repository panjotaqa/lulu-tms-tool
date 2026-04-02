import { ITestCaseService } from './testcase.service.interface';

export const createTestCaseServiceMock = (): jest.Mocked<ITestCaseService> => ({
  create: jest.fn(),
  update: jest.fn(),
  createBulk: jest.fn(),
  findOne: jest.fn(),
  moveTestCases: jest.fn(),
  findByFolder: jest.fn(),
  findByProjectForSelection: jest.fn(),
});
