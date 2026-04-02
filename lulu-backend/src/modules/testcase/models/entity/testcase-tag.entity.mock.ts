import { TestCaseTag } from './testcase-tag.entity';

export const createTestCaseTagMock = (
  overrides?: Partial<TestCaseTag>,
): TestCaseTag => {
  const tct = new TestCaseTag();
  tct.testCaseId =
    overrides?.testCaseId ?? '123e4567-e89b-12d3-a456-426614174000';
  tct.tagId = overrides?.tagId ?? '123e4567-e89b-12d3-a456-426614174001';
  Object.assign(tct, overrides);
  return tct;
};
