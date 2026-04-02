import { CreateTestRunDto } from './create-testrun.dto';

export const createTestRunDtoMock = (
  overrides?: Partial<CreateTestRunDto>,
): CreateTestRunDto => {
  const dto = new CreateTestRunDto();
  dto.title = overrides?.title ?? 'Test title';
  dto.projectId =
    overrides?.projectId ?? '123e4567-e89b-12d3-a456-426614174002';
  dto.startDate = overrides?.startDate ?? new Date().toISOString();
  dto.endDate = overrides?.endDate ?? new Date().toISOString();
  Object.assign(dto, overrides);
  return dto;
};
