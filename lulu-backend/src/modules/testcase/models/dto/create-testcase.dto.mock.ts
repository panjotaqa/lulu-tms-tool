import { CreateTestCaseDto } from './create-testcase.dto';

export const createTestCaseDtoMock = (
  overrides?: Partial<CreateTestCaseDto>,
): CreateTestCaseDto => {
  const dto = new CreateTestCaseDto();
  dto.title = overrides?.title ?? 'Test title';
  dto.testSuiteId =
    overrides?.testSuiteId ?? '123e4567-e89b-12d3-a456-426614174001';
  Object.assign(dto, overrides);
  return dto;
};
