import { Severity } from '@/modules/testcase/models/enums/severity.enum';
import { Status } from '@/modules/testcase/models/enums/status.enum';
import { Priority } from '@/modules/testcase/models/enums/priority.enum';
import { TestType } from '@/modules/testcase/models/enums/test-type.enum';
import { Layer } from '@/modules/testcase/models/enums/layer.enum';
import { Environment } from '@/modules/testcase/models/enums/environment.enum';
import { AutomationStatus } from '@/modules/testcase/models/enums/automation-status.enum';

export interface ITestCaseSnapshot {
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
  tags: Array<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
