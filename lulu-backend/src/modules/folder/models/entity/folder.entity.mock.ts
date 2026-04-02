import { Folder } from './folder.entity';
import { Project } from '@/modules/project/models/entity/project.entity';
import { User } from '@/modules/user/models/entity/user.entity';

export const createFolderEntityMock = (overrides?: Partial<Folder>): Folder => {
  const folder = new Folder();
  folder.id = '123e4567-e89b-12d3-a456-426614174000';
  folder.title = 'Test Folder';
  folder.position = 0;
  folder.projectId = '123e4567-e89b-12d3-a456-426614174001';
  folder.parentFolderId = null;
  folder.createdById = '123e4567-e89b-12d3-a456-426614174003';
  folder.createdAt = new Date('2024-01-01T00:00:00.000Z');
  folder.updatedAt = new Date('2024-01-01T00:00:00.000Z');

  const creator = new User();
  creator.id = folder.createdById;
  creator.name = 'John Doe';
  creator.email = 'john@example.com';
  folder.createdBy = creator;

  const project = new Project();
  project.id = folder.projectId;
  folder.project = project;

  return Object.assign(folder, overrides);
};
