import { CreateTestRunDto } from '../models/dto/create-testrun.dto';
import { QueryTestRunDto } from '../models/dto/query-testrun.dto';
import { UpdateTestRunCaseEvidenceDto } from '../models/dto/update-testrun-case-evidence.dto';
import { UpdateTestRunCaseStatusDto } from '../models/dto/update-testrun-case-status.dto';
import {
  PaginatedTestRunListItemResponse,
  PaginatedTestRunResponse,
  TestRunCaseResponse,
  TestRunResponse,
} from '../models/types/testrun-response.type';

export interface ITestRunService {
  create(
    createTestRunDto: CreateTestRunDto,
    userId: string,
  ): Promise<TestRunResponse>;

  findOne(id: string): Promise<TestRunResponse>;

  updateTestCaseStatus(
    testRunId: string,
    testRunCaseId: string,
    updateDto: UpdateTestRunCaseStatusDto,
  ): Promise<TestRunCaseResponse>;

  updateTestCaseEvidence(
    testRunId: string,
    testRunCaseId: string,
    updateDto: UpdateTestRunCaseEvidenceDto,
  ): Promise<TestRunCaseResponse>;

  updateTestCaseEvidenceById(
    testRunCaseId: string,
    updateDto: UpdateTestRunCaseEvidenceDto,
  ): Promise<TestRunCaseResponse>;

  findByProject(
    projectId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedTestRunResponse>;

  findAll(page?: number, limit?: number): Promise<PaginatedTestRunResponse>;

  findAllList(
    queryDto: QueryTestRunDto,
  ): Promise<PaginatedTestRunListItemResponse>;
}
