import { TestRunCaseStatus } from '../enums/testrun-case-status.enum';
import { TestRunStatus } from '../enums/testrun-status.enum';

export type TestRunStats = {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  pending: number;
  skipped: number;
};

export type TestRunListItemResponse = {
  id: string;
  title: string;
  status: TestRunStatus;
  author: {
    id: string;
    name: string;
    email: string;
  };
  testRunStats: TestRunStats;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedTestRunListItemResponse = {
  data: TestRunListItemResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TestRunCaseResponse = {
  id: string;
  testRunId: string;
  testCaseId: string;
  assignedToId: string | null;
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  status: TestRunCaseStatus;
  testCaseSnapshot: object;
  snapshotCreatedAt: Date;
  evidence: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TestRunResponse = {
  id: string;
  title: string;
  description: string;
  milestone: string | null;
  status: TestRunStatus;
  startDate: Date;
  endDate: Date;
  defaultAssigneeId: string | null;
  defaultAssignee: {
    id: string;
    name: string;
    email: string;
  } | null;
  projectId: string;
  project: {
    id: string;
    title: string;
    slug: string;
  };
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  testRunCases: TestRunCaseResponse[];
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedTestRunResponse = {
  data: TestRunResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

