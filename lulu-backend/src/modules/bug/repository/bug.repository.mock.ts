import { IBugRepository } from './bug.repository.interface';

export const createBugRepositoryMock = (): jest.Mocked<IBugRepository> =>
  ({
    getNextBugSequence: jest.fn(),
    findByProjectWithFilters: jest.fn(),
    findOneWithRelations: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
  }) as unknown as jest.Mocked<IBugRepository>;
