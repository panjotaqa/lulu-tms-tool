import { QueryProjectDto } from './query-project.dto';

export const createQueryProjectDtoMock = (): QueryProjectDto => ({
  page: 1,
  limit: 10,
  isArchived: false,
});
