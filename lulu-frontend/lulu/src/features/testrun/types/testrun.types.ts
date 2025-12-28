export enum TestRunStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum TestRunCaseStatus {
  PENDING = 'Pending',
  PASSED = 'Passed',
  FAILED = 'Failed',
  BLOCKED = 'Blocked',
  SKIPPED = 'Skipped',
}

export interface TestRunStats {
  total: number
  passed: number
  failed: number
  blocked: number
  pending: number
  skipped: number
}

export interface TestRunAuthor {
  id: string
  name: string
  email: string
}

export interface TestRunListItem {
  id: string
  title: string
  status: TestRunStatus
  author: TestRunAuthor
  testRunStats: TestRunStats
  createdAt: string
  updatedAt: string
}

export interface PaginatedTestRunResponse {
  data: TestRunListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateTestRunRequest {
  title: string
  description: string
  milestone?: string
  projectId: string
  defaultAssigneeId?: string
  testCaseIds: string[]
}

export interface TestCaseSnapshot {
  id: string
  testcaseId: string
  title: string
  testSuiteId: string
  testSuite: {
    id: string
    title: string
  }
  severity?: string
  status?: string
  priority?: string
  type?: string
  isFlaky?: boolean
  milestone?: string | null
  userStoryLink?: string | null
  layer?: string
  environment?: string
  automationStatus?: string
  toBeAutomated?: boolean
  description?: string | null
  preConditions?: string | null
  steps?: string[] | null
  tags?: Array<{
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }>
  createdBy?: {
    id: string
    name: string
    email: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface TestRunCase {
  id: string
  testRunId: string
  testCaseId: string
  assignedToId: string | null
  assignedTo: TestRunAuthor | null
  status: TestRunCaseStatus
  testCaseSnapshot: TestCaseSnapshot
  snapshotCreatedAt: string
  createdAt: string
  updatedAt: string
}

export interface TestRun {
  id: string
  title: string
  description: string
  milestone: string | null
  status: TestRunStatus
  defaultAssigneeId: string | null
  defaultAssignee: TestRunAuthor | null
  projectId: string
  project: {
    id: string
    title: string
    slug: string
  }
  createdById: string
  createdBy: TestRunAuthor
  testRunCases: TestRunCase[]
  createdAt: string
  updatedAt: string
}

