import { TestCase } from './testcase.entity';
import { Severity } from '../enums/severity.enum';
import { Status } from '../enums/status.enum';
import { Priority } from '../enums/priority.enum';
import { TestType } from '../enums/test-type.enum';
import { Layer } from '../enums/layer.enum';
import { Environment } from '../enums/environment.enum';
import { AutomationStatus } from '../enums/automation-status.enum';

export const createTestCaseMock = (overrides?: Partial<TestCase>): TestCase => {
  const testcase = new TestCase();
  testcase.id = overrides?.id ?? '123e4567-e89b-12d3-a456-426614174000';
  testcase.testcaseId = overrides?.testcaseId ?? 'PROJ-01';
  testcase.title = overrides?.title ?? 'Test title';
  testcase.testSuiteId =
    overrides?.testSuiteId ?? '123e4567-e89b-12d3-a456-426614174001';
  testcase.severity = overrides?.severity ?? Severity.MAJOR;
  testcase.status = overrides?.status ?? Status.ACTIVE;
  testcase.priority = overrides?.priority ?? Priority.MEDIUM;
  testcase.type = overrides?.type ?? TestType.FUNCTIONAL;
  testcase.isFlaky = overrides?.isFlaky ?? false;
  testcase.milestone = overrides?.milestone ?? null;
  testcase.userStoryLink = overrides?.userStoryLink ?? null;
  testcase.layer = overrides?.layer ?? Layer.E2E;
  testcase.environment = overrides?.environment ?? Environment.INTEGRATION;
  testcase.automationStatus =
    overrides?.automationStatus ?? AutomationStatus.MANUAL;
  testcase.toBeAutomated = overrides?.toBeAutomated ?? false;
  testcase.description = overrides?.description ?? null;
  testcase.preConditions = overrides?.preConditions ?? null;
  testcase.steps = overrides?.steps ?? null;
  testcase.applicationId = overrides?.applicationId ?? null;
  testcase.createdById =
    overrides?.createdById ?? '123e4567-e89b-12d3-a456-426614174002';
  testcase.createdAt = overrides?.createdAt ?? new Date('2024-01-01T00:00:00Z');
  testcase.updatedAt = overrides?.updatedAt ?? new Date('2024-01-01T00:00:00Z');
  Object.assign(testcase, overrides);
  return testcase;
};
