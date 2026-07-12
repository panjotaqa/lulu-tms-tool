import { createBaseServiceMock } from '@/modules/core/interfaces/base-service.mock';
import { IBugService } from './bug.service.interface';

export const createBugServiceMock = (): jest.Mocked<IBugService> => ({
  ...createBaseServiceMock(),
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});
