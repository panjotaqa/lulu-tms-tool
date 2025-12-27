import { AutomationStatus } from '../enums/automation-status.enum';
import { Environment } from '../enums/environment.enum';
import { Layer } from '../enums/layer.enum';
import { Priority } from '../enums/priority.enum';
import { Severity } from '../enums/severity.enum';
import { Status } from '../enums/status.enum';
import { TestType } from '../enums/test-type.enum';

export type TagResponse = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TestCaseResponse = {
  id: string;
  testcaseId: string;
  title: string;
  testSuiteId: string;
  testSuite: {
    id: string;
    title: string;
  };
  severity: Severity;
  status: Status;
  priority: Priority;
  type: TestType;
  isFlaky: boolean;
  milestone: string | null;
  userStoryLink: string | null;
  layer: Layer;
  environment: Environment;
  automationStatus: AutomationStatus;
  toBeAutomated: boolean;
  description: string | null;
  preConditions: string | null;
  steps: string[] | null;
  tags: TagResponse[];
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedTestCaseResponse = {
  data: TestCaseResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type BulkCreateTestCaseResponse = {
  created: number;
  failed: number;
  total: number;
  testCases: TestCaseResponse[];
};

