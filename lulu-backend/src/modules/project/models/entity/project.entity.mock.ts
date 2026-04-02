import { Project } from './project.entity';
import { User } from '@/modules/user/models/entity/user.entity';

export const createProjectEntityMock = (
  overrides?: Partial<Project>,
): Project => {
  const project = new Project();
  project.id = '123e4567-e89b-12d3-a456-426614174000';
  project.title = 'Project Theme';
  project.slug = 'project-theme';
  project.description = 'A detailed description';
  project.isArchived = false;
  project.createdAt = new Date('2024-01-01T00:00:00.000Z');
  project.updatedAt = new Date('2024-01-01T00:00:00.000Z');

  const creator = new User();
  creator.id = '123e4567-e89b-12d3-a456-426614174001';
  creator.name = 'John Doe';
  creator.email = 'john@example.com';

  project.createdBy = creator;
  project.users = [creator];

  return Object.assign(project, overrides);
};
