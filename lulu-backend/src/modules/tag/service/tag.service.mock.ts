import { ITagService } from './tag.service.interface';

export const createTagServiceMock = (): jest.Mocked<ITagService> => ({
  findOrCreateByName: jest.fn(),
  findOrCreateManyByNames: jest.fn(),
  findByIds: jest.fn(),
  findAll: jest.fn(),
});
