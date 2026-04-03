import { CreateBulkTestCasesDto } from '../models/dto/create-bulk-testcases.dto';
import { CreateTestCaseDto } from '../models/dto/create-testcase.dto';
import { QueryTestCaseDto } from '../models/dto/query-testcase.dto';
import { UpdateTestCaseDto } from '../models/dto/update-testcase.dto';
import {
  BulkCreateTestCaseResponse,
  PaginatedTestCaseResponse,
  TestCaseListItemResponse,
  TestCaseResponse,
} from '../models/types/testcase-response.type';

export interface ITestCaseService {
  create(
    createTestCaseDto: CreateTestCaseDto,
    userId: string,
  ): Promise<TestCaseResponse>;

  update(id: string, updateDto: UpdateTestCaseDto): Promise<TestCaseResponse>;

  createBulk(
    createBulkDto: CreateBulkTestCasesDto,
    userId: string,
  ): Promise<BulkCreateTestCaseResponse>;

  findOne(id: string): Promise<TestCaseResponse>;

  moveTestCases(
    testCaseIds: string[],
    targetFolderId: string,
    userId: string,
  ): Promise<TestCaseResponse[]>;

  findByFolder(
    folderId: string,
    queryDto: QueryTestCaseDto,
  ): Promise<PaginatedTestCaseResponse>;

  findByProjectForSelection(
    projectId: string,
  ): Promise<TestCaseListItemResponse[]>;
}
