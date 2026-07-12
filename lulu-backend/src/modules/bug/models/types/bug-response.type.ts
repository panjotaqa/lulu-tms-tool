import { BugStatus } from '../enums/bug-status.enum';
import { Environment } from '@/modules/testcase/models/enums/environment.enum';
import { Priority } from '@/modules/testcase/models/enums/priority.enum';
import { Severity } from '@/modules/testcase/models/enums/severity.enum';

export interface BugUserSummary {
  id: string;
  name: string;
  email: string;
}

export interface BugTagSummary {
  id: string;
  name: string;
}

export interface BugResponse {
  id: string;
  bugId: string;
  title: string;
  description: string | null;
  status: BugStatus;
  severity: Severity;
  priority: Priority;
  environment: Environment | null;
  projectId: string;
  applicationId: string | null;
  testCaseId: string | null;
  testCaseHumanId: string | null;
  testRunCaseId: string | null;
  assignedTo: BugUserSummary | null;
  createdBy: BugUserSummary;
  tags: BugTagSummary[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedBugResponse {
  data: BugResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
