import { createBaseRepository } from '@/modules/core/database/base.repository.mock';
import { IProjectRepository } from './project.repository.interface';
import { Project } from '../models/entity/project.entity';

export const createProjectRepositoryMock =
  (): jest.Mocked<IProjectRepository> => ({
    findPaginated: jest.fn(),
    validateUniqueTitle: jest.fn(),
    validateUniqueSlug: jest.fn(),
    ...createBaseRepository<Project>(),
  });
