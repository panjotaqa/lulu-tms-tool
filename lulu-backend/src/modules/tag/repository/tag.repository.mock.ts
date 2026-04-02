import { ITagRepository } from './tag.repository.interface';

export const createTagRepositoryMock = (): jest.Mocked<ITagRepository> =>
  ({
    findOrCreateByName: jest.fn(),
    findOrCreateManyByNames: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  }) as unknown as jest.Mocked<ITagRepository>;
