import { CreateFolderDto } from './create-folder.dto';

export const createCreateFolderDtoMock = (
  overrides?: Partial<CreateFolderDto>,
): CreateFolderDto => {
  const dto = new CreateFolderDto();
  dto.title = 'Test Folder';
  dto.projectId = '123e4567-e89b-12d3-a456-426614174001';
  dto.parentFolderId = undefined;

  return Object.assign(dto, overrides);
};
