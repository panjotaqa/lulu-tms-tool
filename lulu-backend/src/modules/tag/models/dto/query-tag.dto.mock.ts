import { QueryTagDto } from './query-tag.dto';

export const createQueryTagDtoMock = (
  overrides?: Partial<QueryTagDto>,
): QueryTagDto => {
  const dto = new QueryTagDto();
  dto.search = overrides?.search ?? 'automação';
  Object.assign(dto, overrides);
  return dto;
};
