import { ITestRunService } from './testrun.service.interface';

export const createTestRunServiceMock =
  (): jest.Mocked<ITestRunService> => ({
    create: jest.fn(),
    findOne: jest.fn(),
    updateTestCaseStatus: jest.fn(),
    updateTestCaseEvidence: jest.fn(),
    updateTestCaseEvidenceById: jest.fn(),
    findByProject: jest.fn(),
    findAll: jest.fn(),
    findAllList: jest.fn(),
  });
