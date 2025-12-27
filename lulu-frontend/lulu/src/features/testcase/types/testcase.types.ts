export enum Severity {
  BLOCKER = 'Blocker',
  CRITICAL = 'Critical',
  MAJOR = 'Major',
  MINOR = 'Minor',
  TRIVIAL = 'Trivial',
}

export enum Status {
  DRAFT = 'Draft',
  READY = 'Ready',
  REVIEW = 'Review',
  DEPRECATED = 'Deprecated',
  ACTIVE = 'Active',
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum TestType {
  FUNCTIONAL = 'Functional',
  SECURITY = 'Security',
  PERFORMANCE = 'Performance',
  USABILITY = 'Usability',
}

export enum Layer {
  E2E = 'E2E',
  API = 'API',
  UNIT = 'Unit',
}

export enum Environment {
  INTEGRATION = 'Integration',
  LOCATION = 'Location',
}

export enum AutomationStatus {
  MANUAL = 'Manual',
  AUTOMATED = 'Automated',
}

export interface TagResponse {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface TestCaseResponse {
  id: string
  testcaseId: string
  title: string
  testSuiteId: string
  testSuite: {
    id: string
    title: string
  }
  severity: Severity
  status: Status
  priority: Priority
  type: TestType
  isFlaky: boolean
  milestone: string | null
  userStoryLink: string | null
  layer: Layer
  environment: Environment
  automationStatus: AutomationStatus
  toBeAutomated: boolean
  description: string | null
  preConditions: string | null
  steps: string[] | null
  tags: TagResponse[]
  createdBy: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateTestCaseRequest {
  title: string
  testSuiteId: string
  severity?: Severity
  status?: Status
  priority?: Priority
  type?: TestType
  isFlaky?: boolean
  milestone?: string
  userStoryLink?: string
  layer?: Layer
  environment?: Environment
  automationStatus?: AutomationStatus
  toBeAutomated?: boolean
  description?: string
  preConditions?: string
  steps?: string[]
  tags?: string[]
}

export interface UpdateTestCaseRequest {
  title?: string
  testSuiteId?: string
  severity?: Severity
  status?: Status
  priority?: Priority
  type?: TestType
  isFlaky?: boolean
  milestone?: string
  userStoryLink?: string
  layer?: Layer
  environment?: Environment
  automationStatus?: AutomationStatus
  toBeAutomated?: boolean
  description?: string
  preConditions?: string
  steps?: string[]
  tags?: string[]
}

