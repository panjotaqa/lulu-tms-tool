import { IApplicationService } from './application.service.interface';

export const createApplicationServiceMock =
  (): jest.Mocked<IApplicationService> => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  });
