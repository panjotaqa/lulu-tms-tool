import { BugStatus } from '../enums/bug-status.enum';
import { Environment } from '@/modules/testcase/models/enums/environment.enum';
import { Priority } from '@/modules/testcase/models/enums/priority.enum';
import { Severity } from '@/modules/testcase/models/enums/severity.enum';
import { Bug } from './bug.entity';

export const createBugEntityMock = (overrides?: Partial<Bug>): Bug => {
  const bug = new Bug();
  bug.id = overrides?.id ?? '123e4567-e89b-12d3-a456-426614174000';
  bug.bugId = overrides?.bugId ?? 'LULU-BUG-01';
  bug.title = overrides?.title ?? 'Bug de teste';
  bug.description = overrides?.description ?? null;
  bug.status = overrides?.status ?? BugStatus.OPEN;
  bug.severity = overrides?.severity ?? Severity.TRIVIAL;
  bug.priority = overrides?.priority ?? Priority.MEDIUM;
  bug.environment = overrides?.environment ?? Environment.INTEGRATION;
  bug.projectId = overrides?.projectId ?? '123e4567-e89b-12d3-a456-426614174001';
  bug.applicationId = overrides?.applicationId ?? null;
  bug.testCaseId = overrides?.testCaseId ?? null;
  bug.testRunCaseId = overrides?.testRunCaseId ?? null;
  bug.assignedToId = overrides?.assignedToId ?? null;
  bug.createdById = overrides?.createdById ?? '123e4567-e89b-12d3-a456-426614174002';
  bug.createdAt = overrides?.createdAt ?? new Date();
  bug.updatedAt = overrides?.updatedAt ?? new Date();
  return Object.assign(bug, overrides);
};
