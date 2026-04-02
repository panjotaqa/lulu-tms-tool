import { TestRunCase } from './testrun-case.entity';
import { TestRunCaseStatus } from '../enums/testrun-case-status.enum';

export const createTestRunCaseMock = (
  overrides?: Partial<TestRunCase>,
): TestRunCase => {
  const trc = new TestRunCase();
  trc.id = overrides?.id ?? '123e4567-e89b-12d3-a456-426614174004';
  trc.testRunId = overrides?.testRunId ?? '123e4567-e89b-12d3-a456-426614174000';
  trc.testCaseId =
    overrides?.testCaseId ?? '123e4567-e89b-12d3-a456-426614174005';
  trc.status = overrides?.status ?? TestRunCaseStatus.PENDING;
  trc.testCaseSnapshot = overrides?.testCaseSnapshot ?? {};
  trc.snapshotCreatedAt = overrides?.snapshotCreatedAt ?? new Date();
  Object.assign(trc, overrides);
  return trc;
};
