import { IFolderService } from './folder.service.interface';

export const createFolderServiceMock = (): jest.Mocked<IFolderService> => ({
  create: jest.fn(),
  updateTitle: jest.fn(),
  move: jest.fn(),
  reorder: jest.fn(),
  findByProject: jest.fn(),
  getFolderHierarchy: jest.fn(),
});
