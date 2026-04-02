import { TestRun } from './testrun.entity';
import { TestRunStatus } from '../enums/testrun-status.enum';

export const createTestRunMock = (overrides?: Partial<TestRun>): TestRun => {
  const testRun = new TestRun();
  testRun.id = overrides?.id ?? '123e4567-e89b-12d3-a456-426614174000';
  testRun.title = overrides?.title ?? 'Test title';
  testRun.projectId =
    overrides?.projectId ?? '123e4567-e89b-12d3-a456-426614174002';
  testRun.status = overrides?.status ?? TestRunStatus.NOT_STARTED;
  testRun.startDate = overrides?.startDate ?? new Date();
  testRun.endDate = overrides?.endDate ?? new Date();
  testRun.createdById =
    overrides?.createdById ?? '123e4567-e89b-12d3-a456-426614174003';
  testRun.defaultAssigneeId = overrides?.defaultAssigneeId ?? null;
  testRun.createdAt = overrides?.createdAt ?? new Date('2024-01-01T00:00:00Z');
  testRun.updatedAt = overrides?.updatedAt ?? new Date('2024-01-01T00:00:00Z');
  Object.assign(testRun, overrides);
  return testRun;
};
