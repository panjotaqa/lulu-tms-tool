import { IProjectService } from './project.service.interface';

export const createProjectServiceMock = (): jest.Mocked<IProjectService> => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findArchived: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  archive: jest.fn(),
  unarchive: jest.fn(),
  linkUser: jest.fn(),
  unlinkUser: jest.fn(),
});
