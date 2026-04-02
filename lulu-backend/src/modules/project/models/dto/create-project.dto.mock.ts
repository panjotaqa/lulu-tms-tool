import { CreateProjectDto } from './create-project.dto';

export const createCreateProjectDtoMock = (
  overrides?: Partial<CreateProjectDto>,
): CreateProjectDto => {
  const dto = new CreateProjectDto();
  dto.title = 'Project Theme';
  dto.slug = 'project-theme';
  dto.description = 'A detailed description';

  return Object.assign(dto, overrides);
};
